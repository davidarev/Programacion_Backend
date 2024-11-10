import { MongoClient, ObjectId } from 'mongodb';
import {fromModelToLibro} from "./utilities.ts"
import { ModelLibro, ModeloAutor } from './types.ts';

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL){
  console.error("No existe la URL a MongoDB");
  Deno.exit(1);
}

const mongo_cliente = new MongoClient(MONGO_URL);
await mongo_cliente.connect();

const db = mongo_cliente.db("examen_parcial");
const colecionLibros = db.collection<ModelLibro>("libros");
const colecionAutores = db.collection<ModeloAutor>("autores");

const handler = async (req: Request): Promise<Response> => {
  const metodo = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if(metodo === "GET"){
    //Funciona correctamente
    if(path === "/libros"){
      const titulo = url.searchParams.get("titulo");
      if(titulo){
        const librosDB = await colecionLibros.find({titulo}).toArray()
        if(librosDB.length === 0) return new Response("Libros no encontrados", {status: 404});
        else{
          const libros = await Promise.all(librosDB.map((l) => fromModelToLibro(l, colecionAutores)));
          return new Response(JSON.stringify(libros), {status: 200});
        }
      }
      else{
        const librosDB = await colecionLibros.find().toArray()
        if(librosDB.length === 0) return new Response("Libros no encontrados", {status: 404});
        else{
          const libros = await Promise.all(librosDB.map((l) => fromModelToLibro(l, colecionAutores)));
          return new Response(JSON.stringify(libros), {status: 200});
        }
      }
    }
    //Funciona correctamente
    else if(path === "/libro"){
      const id = url.searchParams.get("id");
      if(!id) return new Response("Bad request. ID no introducido", {status: 400});
      else{
        const libroDB = await colecionLibros.findOne({_id: new ObjectId(id)}); 
        if(libroDB === null) return new Response("Libro no encontrado", {status: 404});
        else{
          const libro = await fromModelToLibro(libroDB, colecionAutores);
          return new Response(JSON.stringify(libro), {status: 200});
        }
      }
    }
    return new Response("Ruta no encontrada", {status: 404});  
  }
  else if(metodo === "POST"){
    //Funciona correctamente
    if(path === "/libro"){
      const libro = await req.json();
      if(!libro.titulo || !libro.copias || !libro.autores) return new Response("Bad request. Body incorrecto", {status: 400});
      else{
        const libroDB = await colecionLibros.findOne({titulo: libro.titulo}); //Lo ideal seria utilizar un identificador del libro (como el ISBN)
        if(libroDB !== null) return new Response("El libro ya existe", {status: 409});
        else{
          const {insertedId} = await colecionLibros.insertOne({
            titulo: libro.titulo,
            copias: libro.copias,
            autores: [],
          });
          return new Response(JSON.stringify({
              _id: insertedId,
              titulo: libro.titulo,
              copias: libro.copias,
              autores: [],
          }), {status: 201});
        }
      }
    }
    //Funciona correctamente
    else if(path === "/autor"){
      const autor = await req.json();
      if(!autor.nombre || !autor.biografia) return new Response("Bad request. Body incorrecto", {status: 400});
      else{
        const autorDB = await colecionAutores.findOne({nombre: autor.nombre});
        if(autorDB !== null) return new Response("El autor ya existe", {status: 409});
        else{
          const {insertedId} = await colecionAutores.insertOne({
            nombre: autor.nombre,
            biografia: autor.biografia,
          });
          return new Response(JSON.stringify({
              _id: insertedId,
              nombre: autor.nombre,
              biografia: autor.biografia,
          }), {status: 201})
        }
      }
    }
    return new Response("Ruta no encontrada", {status: 404});  
  }
  else if(metodo === "DELETE"){
    //Funciona correctamente
    if(path === "/libro"){
      const id = url.searchParams.get("id");
      if(!id) return new Response("Bad request. Hay que indicar el ID del libro", {status: 400});
      else{
        const {deletedCount} = await colecionLibros.deleteOne({
          _id: new ObjectId(id),
        })

        if(deletedCount === 0) return new Response("No se ha encontrado el libro", {status: 404});
        else return new Response("Libro borrado", {status: 200});
      }
    }
    return new Response("Ruta no encontrada", {status: 404});
  }
  return new Response("Metodo no encontrado", {status: 404});
}

Deno.serve({port: 3000}, handler);