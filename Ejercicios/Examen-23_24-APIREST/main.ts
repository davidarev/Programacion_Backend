import { APIPhone, ContactoModel } from "./types.ts";
import {MongoClient, ObjectId} from "mongodb"
import { fromModelToContacto } from "./utilities.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL) {
  console.error("MONGO_URL no existe"); 
  Deno.exit(1)
}
const cliente_mongo = new MongoClient(MONGO_URL);
await cliente_mongo.connect();

const DB = cliente_mongo.db("simulacro_examen_final");
const collectionContacto = DB.collection<ContactoModel>("contacto");

const handler = async (req: Request): Promise<Response> => {
  const metodo = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  if(metodo === "GET"){
    if(path === "/contactos"){
      const contactosDB = await collectionContacto.find().toArray();
      const contactos = await Promise.all(contactosDB.map((c) => fromModelToContacto(c)));
      return new Response(JSON.stringify(contactos))
    }
    if(path === "/contacto"){
      const id = url.searchParams.get("id");
      if(!id) return new Response("ERROR: No has introducido el ID", {status: 400});
      const contactoDB = await collectionContacto.findOne({_id: new ObjectId(id)});
      if(!contactoDB) return new Response("ERROR: El usuario que buscas no existe", {status: 404});
      const contacto = await fromModelToContacto(contactoDB);
      return new Response(JSON.stringify(contacto), {status: 200});
    }
    return new Response("Path dont found", {status: 404});
  }
  else if(metodo === "POST"){
    if(path === "/contacto"){
      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new Error("ERROR: No se ha obtenido la API KEY de la API Ninja");

      const body = await req.json();
      const {name, last_name, phone} = body;

      if(!name || !last_name || !phone) return new Response("ERROR: No se han introducido todos los parametros", {status: 400});
      const ExistesPhone = await collectionContacto.countDocuments({phone});
      if(ExistesPhone >= 1) return new Response("ERROR: El telefono que has introducido ya existe en la BBDD", {status: 409});

      const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`;
      const data = await fetch(url, {
          headers: {
              'X-Api-Key': API_KEY
          }
      });
      if(data.status !== 200) return new Response("ERROR: No se ha obtenido la DATA de la API Ninja", {status: data.status});

      const response: APIPhone = await data.json();
      if(response.is_valid === false) return new Response("ERROR: El telefono introducido no es valido", {status: 400});
      const country = response.country;
      const timezone = response.timezones[0];

      const {insertedId} = await collectionContacto.insertOne({
        name, last_name, phone, country, timezone
      });

      const contacto = {
        id: insertedId,
        name, last_name, phone, country, timezone
      }

      return new Response(JSON.stringify(contacto), {status: 201});

    }
    return new Response("Path dont found", {status: 404});
  }
  else if(metodo === "DELETE"){
    if(path === "/contacto"){
      const body = await req.json();
      const {id} = body;
      if(!id) return new Response("ERROR: No se han introducido todos los parametros", {status: 400});
      const {deletedCount} = await collectionContacto.deleteOne({_id: new ObjectId(id)});
      if(deletedCount === 0) return new Response("El usuario no existe", {status: 404});
      return new Response("Usuario eliminado", {status: 200});
    }
    return new Response("Path dont found", {status: 404});
  }
  return new Response("Mathod not found", {status: 404});
}

Deno.serve({port: 3000}, handler);