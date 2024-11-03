import { MongoClient } from "mongodb";
import type { BookModel, UserModel } from "./types.ts";
import { fromModelToUser } from "./utilities.ts";

//Compruebo si la URL del cluster de MongoDb existe en el archivo '.env'
const MONGO_URL = Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
  console.error("MONGO_URL is not set");
  Deno.exit(1);
}

//Creo un nuevo cliente y lo conecto 
const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("Connected to MongoDB");

//Creo la BBBDD y las colecciones
const db = client.db("mybbdd");
const usersCollection = db.collection<UserModel>("users");
const booksCollection = db.collection<BookModel>("books");

const handler = async (req: Request): Promise<Response> => {
  //Elementos de la API
  const method = req.method;
  const url = new URL(req.url);
  const path = url.pathname;

  //METODO GET
  if(method === "GET") {
    //PATH .../users
    if(path === "/users") {
      const name = url.searchParams.get("name"); //Creo el parametro nombre
      if(name) {
        const usersDB = await usersCollection.find({name}).toArray(); //Encuentro el objeto dentro de la coleccion y lo guardo en un array UserModel
        /*
        Recorro el array usersDB y transformo los elementos al tipo User mediante la función 'fromModelToUser'. 
        Eso me dará un array de Promesas de usuarios Promise<User>[]. Con la funcion 'Promise.all()' obetengo un array de User.
        */
        const users = await Promise.all(usersDB.map((u) => fromModelToUser(u, booksCollection))); 
        //Realizo las comprobaciones necesarias
        if(users.length === 0) return new Response("No se han encontrado usuarios", {status: 404});
        return new Response(JSON.stringify(users));
      }

      //Si no encuentro el nombre, imprimo todos los usuarios
      const usersDB = await usersCollection.find().toArray();
      const users = await Promise.all(usersDB.map((u) => fromModelToUser(u, booksCollection)));
      if(users.length === 0) return new Response("No se han encontrado usuarios", {status: 404});
      return new Response(JSON.stringify(users));
    } 
    //PATH .../user
    else if(path === "/user") {
      const email = url.searchParams.get("email"); //Creo el parametro email
      if(!email) return new Response("Bad request", {status: 400}); //Compruebo si se introduce el parametro
      const userDB = await usersCollection.findOne({email});
      if (!userDB) return new Response("User not found", {status: 404}); //Compruebo si existe el usuario
      const user = await fromModelToUser(userDB, booksCollection);
      return new Response(JSON.stringify(user));
    }
  } 
  //METODO POST
  else if(method === "POST") {
    //PATH .../user
    if(path === "/user") {
      const user = await req.json(); //Creo el 'body' del metodo
      if (!user.name || !user.email || !user.age) return new Response("Bad request", { status: 400 }); //Compruebo si se introduce el body correctamente
      /*
      Compruebo si ya existe el usuario. Uso la funcion findOne porque me basta con que encuentre un usuario, 
      la funcion find recorre todo el array aunque ya halla encontrado una equivalencia (menos eficiente)
      */
      const userDB = await usersCollection.findOne({email: user.email,});
      if(userDB) return new Response("User already exists", {status: 409});

      //Inserto un nuevo elemento con los datos introducidos
      const {insertedId} = await usersCollection.insertOne({
        name: user.name,
        email: user.email,
        age: user.age,
        books: [],
      });
      //Devuelvo el elemento
      return new Response(
        JSON.stringify({
          name: user.name,
          email: user.email,
          age: user.age,
          id: insertedId,
        }), {status: 201}
      );
    }
  } 
  //METODO PUT
  else if(method === "PUT") {
    const user = await req.json();
    if(!user.name || !user.email || !user.age) return new Response("Bad request", {status: 400});
    //Modifico el valor encontrado
    const {modifiedCount} = await usersCollection.updateOne(
      {email: user.email},
      {$set: {name: user.name, age: user.age}}
    );

    if(modifiedCount === 0) return new Response("User not found", {status: 404});

    return new Response("OK", {status: 200});
  } 
  //METODO DELETE
  else if(method === "DELETE") {
    const user = await req.json();
    if(!user.email) return new Response("Bad request", {status: 400});

    const {deletedCount} = await usersCollection.deleteOne({email: user.email,}); //Elimino el elemento y me devuelve un 0 o un 1
    if(deletedCount === 0) return new Response("User not found", {status: 404});
    return new Response("OK", {status: 200});
  }

  return new Response("endpoint not found", {status: 404});
};

Deno.serve({ port: 3000 }, handler);
