/*
  Tipos de datos:
    - Clientes:
      + Nombre
      + Apellido
      + DNI
      + Edad
      + Coches
      + Movil
    - Coches:
      + Marca
      + Modelo
      + Matricula
    - Moviles:
      + Marca
      + Numero de serie
      + Modelo

  Funciones de la API:
    - GET
      + /clientes: Devuelve los datos de todos los clientes. Si busca por nombre, devuelve todos los clientes con ese nombre; lo mismo para coche y telefono.
      + /cliente: Busca por DNI y devuelve un unico usuario
      + /coches: Devuelve los datos de todos los coches. Si busca por marca, devuelve todos los coches con ese marca
      + /coche: Busca por matricula y devuelve un unico coche
      + /telefonos: Devuelve los datos de todos los telefonos. Si busca por marca, devuelve todos los telefonos con ese marca
      + /telefono: Busca por numero de serie y devuelve un unico telefono
    + POST
      + /cliente: Añade un nuevo cliente con todos sus datos
      + /coche: Añade un nuevo coche con todos sus datos
      + /telefono: Añade un nuevo telefono con todos sus datos
    + PUT
      + /cliente: Actualiza un cliente
      + /coche: Actualiza un coche
      + /telefono: Actualiza un clitelefonoente
    + DELETE:
      + /cliente: Borra un cliente
      + /coche: Borra un coche
      + /telefono: Borra un clitelefonoente
*/

import { CocheModel, ClienteModel, TelefonoModel} from "./types.ts";
import {MongoClient, ObjectId} from "mongodb"
import { fromModelToCliente } from './utilities.ts';
import { fromModelToCoche } from './utilities.ts';
import { fromModelToTelefono } from './utilities.ts';

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL) {
  console.error("MONGO_URL no existe"); 
  Deno.exit(1)
}
const cliente_mongo = new MongoClient(MONGO_URL);
await cliente_mongo.connect();


const DB = cliente_mongo.db("simulacro_examen_parcial");
const clienteCollection = DB.collection<ClienteModel>("clientes");
const cocheCollection = DB.collection<CocheModel>("coches");
const telefonoCollection = DB.collection<TelefonoModel>("telefonos");

const handler = async (req: Request): Promise<Response> => {
  const metodo = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if(metodo === "GET"){
    if(path === "/clientes"){
      const nombre = url.searchParams.get("nombre");
      if(!nombre){
        const clientesDB = await clienteCollection.find().toArray();
        const clientes = await Promise.all(clientesDB.map((cliente) => fromModelToCliente(cliente, cocheCollection, /*telefonoCollection*/)));
        return new Response(JSON.stringify(clientes), {status: 200});
      }
      else{
        const clientesDB = await clienteCollection.find({nombre}).toArray();
        if(clientesDB.length === 0){
          return new Response("Clientes no encontrados", {status: 404});
        }
        else{
          const clientes = await Promise.all(clientesDB.map((cliente) => fromModelToCliente(cliente, cocheCollection, /*telefonoCollection*/)));
          return new Response(JSON.stringify(clientes), {status: 200}); 
        }
        
      }
    }
    else if(path === "/cliente"){
      const dni = url.searchParams.get("dni");
      if(!dni){
        return new Response("Bad Request", {status: 400});
      }
      else{
        const clienteDB = await clienteCollection.findOne({dni});
        if(!clienteDB){
          return new Response("Cliente no encontrado", {status: 404});
        }
        else{
          const cliente = await fromModelToCliente(clienteDB, cocheCollection, /*telefonoCollection*/);
          return new Response(JSON.stringify(cliente), {status: 200});
        }
      }
    }
    else if(path === "/coches"){
      const marca = url.searchParams.get("marca");
      if(!marca){
        const cochesDB = await cocheCollection.find().toArray();
        const coches = await Promise.all(cochesDB.map((coche) => fromModelToCoche(coche)));
        return new Response(JSON.stringify(coches), {status: 200});
      }
      else{
        const cochesDB = await cocheCollection.find({marca}).toArray();
        if(cochesDB.length === 0){
          return new Response("Coches no encontrados", {status: 404});
        }
        else{
          const coches = await Promise.all(cochesDB.map((coche) => fromModelToCoche(coche)));
          return new Response(JSON.stringify(coches), {status: 200}); 
        }
      }
    }
    else if(path === "/coche"){
      const matricula = url.searchParams.get("matricula");
      if(!matricula){
        return new Response("Bad Request", {status: 400});
      }
      else{
        const cocheDB = await cocheCollection.findOne({matricula});
        if(cocheDB === null){
          return new Response("Coche no encontrado", {status: 404});
        }
        else{
          const coche = await fromModelToCoche(cocheDB);
          return new Response(JSON.stringify(coche), {status: 200});
        }
      }
    }
    else if(path === "/telefonos"){
      const marca = url.searchParams.get("marca");
      if(!marca){
        const telefonosDB = await telefonoCollection.find().toArray();
        const telefonos = await Promise.all(telefonosDB.map((telefono) => fromModelToTelefono(telefono)));
        return new Response(JSON.stringify(telefonos), {status: 200});
      }
      else{
        const telefonosDB = await telefonoCollection.find({marca}).toArray();
        if(telefonosDB.length === 0){
          return new Response("Coche no encontrados", {status: 404});
        }
        else{
          const telefonos = await Promise.all(telefonosDB.map((telefono) => fromModelToTelefono(telefono)));
          return new Response(JSON.stringify(telefonos), {status: 200}); 
        }
      }
    }
    else if(path === "/telefono"){
      const numero_serie = url.searchParams.get("numero_serie");
      if(!numero_serie){
        return new Response("Bad Request", {status: 400});
      }
      else{
        const telefonoDB = await telefonoCollection.findOne({numero_serie});
        if(telefonoDB === null){
          return new Response("Telefono no encontrado", {status: 404});
        }
        else{
          const telefono = await fromModelToTelefono(telefonoDB);
          return new Response(JSON.stringify(telefono), {status: 200});
        }
      }
    }
    return new Response("Path dont found", {status: 404});
  }
  else if(metodo === "POST"){
    if(path === "/cliente"){
      const cliente = await req.json();
      if(!cliente.nombre || !cliente.apellido || !cliente.dni || !cliente.edad || /*!cliente.telefono ||*/ !cliente.coches){
        return new Response("Bad request", {status: 400});
      }
      else{
        const clienteDB = await clienteCollection.findOne({dni: cliente.dni});
        if(clienteDB) return new Response("El cliente ya existe", {status: 409});
        else{
          const {insertedId} = await clienteCollection.insertOne({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            edad: cliente.edad,
            dni: cliente.dni,
            coches: [],
          });

          return new Response(JSON.stringify({
            id: insertedId,
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            edad: cliente.edad,
            dni: cliente.dni,
            coches: [],
          }), {status: 201});
        }
      }
    }
    else if(path === "/coche"){
      const coche = await req.json();
      if(!coche.marca || !coche.modelo || !coche.matricula){
        return new Response("Bad request", {status: 400});
      }
      else{
        const cocheDB = await cocheCollection.findOne({matricula: coche.matricula});
        if(cocheDB) return new Response("Este coche ya existe", {status: 409});
        else{
          const {insertedId} = await cocheCollection.insertOne({
            marca: coche.marca,
            modelo: coche.modelo,
            matricula: coche.matricula,
          });
          return new Response(JSON.stringify({
            id: insertedId,
            marca: coche.marca,
            modelo: coche.modelo,
            matricula: coche.matricula,
          }), {status: 201});
        }
      }
    }
    else if(path === "/telefono"){
      const telefono = await req.json();
      if(!telefono.marca || !telefono.modelo || !telefono.numero_serie){
        return new Response("Bad request", {status: 400});
      }
      else{
        const telefonoDB = await telefonoCollection.findOne({numero_serie: telefono.numero_serie});
        if(telefonoDB) return new Response("El telefono ya existe", {status: 409});
        else{
          const {insertedId} = await telefonoCollection.insertOne({
            marca: telefono.marca,
            modelo: telefono.modelo,
            numero_serie: telefono.numero_serie,
          });
          return new Response(JSON.stringify({
            id: insertedId,
            marca: telefono.marca,
            modelo: telefono.modelo,
            numero_serie: telefono.numero_serie,
          }))
        }
      }
    }
    return new Response("Path dont found", {status: 404});
  }
  else if(metodo === "PUT"){
    if(path === "/cliente"){

    }
    else if(path === "/coche"){

    }
    else if(path === "/telefono"){

    }
    return new Response("Path dont found", {status: 404});
  }
  else if(metodo === "DELETE"){
    if(path === "/cliente"){
      const id = url.searchParams.get("id");
      if(!id) return new Response("Bad request", {status: 400});
      else{
        const {deletedCount} = await clienteCollection.deleteOne({
          _id: new ObjectId(id),
        })
        if(deletedCount === 0) return new Response("Usuario no encontrado", {status: 404});
        else return new Response("Usuario borrado", {status: 200});
      }
    }
    else if(path === "/coche"){
       const id = url.searchParams.get("id");
       if(!id) return new Response("Bad request", {status: 400});
       else{
        const {deletedCount} = await cocheCollection.deleteOne({
          _id: new ObjectId(id),
        })
        if(deletedCount === 0) return new Response("Usuario no encontrado", {status: 404});
        else{
          await clienteCollection.updateMany({coches: new ObjectId(id)}, {$pull: {coches: new ObjectId(id)}});
          return new Response("Coche borrado", {status: 200});
        }
       }
    }
    else if(path === "/telefono"){
      const id = url.searchParams.get("id");
      if(!id) return new Response("Bad request", {status: 400});
      else{
        const {deletedCount} = await telefonoCollection.deleteOne({
          _id: new ObjectId(id),
        })

        if(deletedCount === 0) return new Response("El telefono no existe", {status: 404});
        else return new Response("Telefono borrado", {status: 200});
      }
    }
    return new Response("Path dont found", {status: 404});
  }
  return new Response("Mathod not found", {status: 404});
}

Deno.serve({port: 3000}, handler);