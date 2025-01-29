import { MongoClient, ObjectId } from "mongodb";
import { APIIBAN, BancoModel, Usuario, UsuarioModel } from "./types.ts";
import { fromModelToUsuario } from './utilities.ts';
import { fromModelToBanco } from './utilities.ts';

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL) throw new Error("Falta la URL del driver de mongodb");

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

const db = mongoClient.db("financiero");
const collectionUsuarios = db.collection<UsuarioModel>("usuarios");
export const collectionBancos = db.collection<BancoModel>("bancos")

const handler = async (request: Request): Promise<Response> => {
  const metodo = request.method;
  const url = new URL(request.url);
  const path = url.pathname;

  if(metodo === "GET"){
    if(path === "/usuarios"){
      const name = url.searchParams.get("name");
      if(!name){
        const usuariosDB = await collectionUsuarios.find().toArray();
        const usuarios = await Promise.all(usuariosDB.map((u) => fromModelToUsuario(u, collectionBancos)));
        return new Response(JSON.stringify(usuarios), {status: 200});
      }
      else{
        const usuariosDB = await collectionUsuarios.find({name}).toArray();
        const usuarios = await Promise.all(usuariosDB.map((u) => fromModelToUsuario(u, collectionBancos)));
        return new Response(JSON.stringify(usuarios), {status: 200});
      }
    }
    else if(path === "/usuario"){
      const id = url.searchParams.get("id");
      if(!id) return new Response("Falta el ID", {status: 400});
      const usuarioDB = await collectionUsuarios.findOne({_id: new ObjectId(id)});
      if(!usuarioDB) return new Response("EL usuario no existe", {status: 404});
      const usuario =  await fromModelToUsuario(usuarioDB, collectionBancos);
      return new Response(JSON.stringify(usuario), {status: 200});
    }
    else if(path === "/bancos"){
      const name = url.searchParams.get("name");
      if(!name){
        const bancosDB = await collectionBancos.find().toArray();
        const bancos = await Promise.all(bancosDB.map((b) => fromModelToBanco(b, collectionUsuarios)));
        return new Response(JSON.stringify(bancos), {status: 200});
      }
      else{
        const bancoDB = await collectionBancos.find({name}).toArray();
        const banco = await Promise.all(bancoDB.map((b) => fromModelToBanco(b, collectionUsuarios)));
        return new Response(JSON.stringify(banco), {status: 200});
      }
    }
    else{
      return new Response("No se encuentra el path", {status: 404});
    }
  }
  else if(metodo === "POST"){
    if(path === "/usuario"){
      const API_KEY = Deno.env.get("API_KEY");
      if(!API_KEY) return new Response("Falta el API KEY de la API Ninja");

      const usuario = await request.json();
      const {name, iban} = usuario;
      if(!name || !iban) return new Response("Bad request", {status: 404});
      const usuarioDB = await collectionUsuarios.findOne({iban: iban});
      if(usuarioDB) return new Response("El usuario ya existe", {status: 409});
      
      const url = `https://api.api-ninjas.com/v1/iban?iban=${iban}`
      const data = await fetch(url, {
        headers: {
          'X-Api-Key': API_KEY
        }
      });
      if(data.status !== 200) return new Response("ERROR", {status: data.status});
      const response: APIIBAN = await data.json();
      const account_number = response.account_number;
      const bank_name = response.bank_name;
      const banco = await collectionBancos.findOne({name: bank_name});
      if(!banco) return new Response("Banco no encontrado");
      const bank = new ObjectId(banco._id);

      const {insertedId} = await collectionUsuarios.insertOne({
        name, account_number, iban, bank
      });

      await collectionBancos.updateOne({_id: bank}, {$push: {usuarios: insertedId}});

      return new Response(JSON.stringify({
        id: insertedId,
        name: name,
        account_number: account_number,
        iban: iban,
        bank: bank
      }), {status: 201});
    }
    else if(path === "/banco"){
      const banco = await request.json()
      const {name} = banco;
      if(!name) return new Response("Bad request", {status: 400});
      const bancoDB = await collectionBancos.findOne({name: name});
      if(bancoDB) return new Response("El banco ya existe", {status: 409});
      const usuarios: ObjectId = []
      const {insertedId} = await collectionBancos.insertOne({
        name, usuarios
      });
      return new Response(JSON.stringify({
        id: insertedId,
        name: name,
        usuarios: usuarios
      }), {status: 201});
    }
    else{
      return new Response("No se encuentra el path", {status: 404});
    }
  }
  else if(metodo === "DELETE"){
    if(path === "/usuario"){
      const body = await request.json();
      const {id} = body;
      if(!id) return new Response("No has indicado el ID", {status: 404});
      const {deletedCount} = await collectionUsuarios.deleteOne({_id: new ObjectId(id)});
      if(deletedCount === 0) return new Response("El usuario no existe", {status: 404});
      return new Response("Usuario eliminado", {status: 200});
    }
    return new Response("No se encuentra el path", {status: 404});
  }
  return new Response("No se encuentra la ruta", {status: 404});
}

Deno.serve({ port: 3000 }, handler);