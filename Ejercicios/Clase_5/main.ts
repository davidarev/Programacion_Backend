/*
  Implementa un servidor en Deno que permita gestionar una lista de usuarios, donde cada usuario tiene un `name` y un `email` (el email es único). 
  El servidor debe soportar las siguientes operaciones:
    1. GET /users:  
      - Devuelve todos los usuarios.
      - Si se pasa un parámetro `name`, devuelve solo los usuarios con ese nombre.
    2. GET /user:
      - Devuelve un usuario si se pasa el `email` como parámetro.
    3. POST /user: 
      - Añade un nuevo usuario enviando un objeto JSON con `name` y `email`.
      - No permite duplicados de email.
    4. DELETE /user: 
      - Elimina un usuario enviando su `email` en el cuerpo de la solicitud.
  Realizar las validaciones que se consideren necesarias.
 */

type User = {
  name: string,
  email: string //Es unico
}

let usuarios = [
  {name: "David", email: "david@gmail.com"},
  {name: "Santi", email: "santi@gmail.com"},
  {name: "Kerit", email: "kerit@gmail.com"}
];

const handler = async (req: Request): Promise<Response> => {
  //Elementos request
  const method = req.method; //Creo una variable para el metodo
  const url = new URL(req.url); //Creo una variable para la URL
  const path = url.pathname; //Creo una variable para el path

  //METODOS
  //Metodo GET
  if(method === "GET"){
    //PATH /users
    if(path === "/users"){
      const name = url.searchParams.get("name"); //Creo el parametro de busqueda name
      if(!name) return new Response(JSON.stringify(usuarios)); //Si el name no esta, devuelvo todos los usuarios
      else{
        const result = usuarios.filter((elem: User) => elem.name === name); //Filtro los usuarios con el name introducido
        if(result.length === 0) return new Response("Usuers not found", {status: 404}); //Si no hay ningun usuario, devuelvo un error 404
        else return new Response(JSON.stringify(result)); //Devuelvo los usuarios localizados con el parametro
      }
    }
    //PATH /user
    else if(path === "/user"){
      const email = url.searchParams.get("email"); //Creo un parametro email
      if(!email) return new Response("Bad request", {status: 400}); //Si no hay email devuelvo un error 400
      else{
        const result = usuarios.filter((elem: User) => elem.email === email); //Filtro los usuarios con el email introducido
        if(result.length === 0) return new Response("Users not found", {status: 404}); //Si no hay ningun usuario, devuelvo un error 404
        else return new Response(JSON.stringify(result)); //Devuelvo los usuarios localizados con el parametro
      }
    }
    else return new Response("Bad request", {status: 400}); //Si el path es otro, devuelvo un 400
  }
  //Metodo POST
  else if(method === "POST"){
    //PATH /user
    if(path === "/user"){
      const user = await req.json();
      if(!user.name || !user.email) return new Response("Bad request", {status: 400}); //Compruebo si hay parametros
      else{
        if(usuarios.find((elem: User) => elem.name === user.name && elem.email === user.email)) return new Response("Usuario duplicado", {status: 409}); //Compruebo si ya hay un duplicado
        else if(usuarios.find((elem: User) => elem.email === user.email)) return new Response("Ya hay un usuario con este mail", {status: 409}); //Compruebo si ya hay un usuario con ese mail
        else {
          usuarios.push({name: user.name, email: user.email});
          return new Response("Usuario añadido", {status: 200});
        }
      }
    }
    else return new Response("Bad request", {status: 400}); //Si el path es otro, devuelvo un 400
  }
  //Metodo DELETE
  else if(method === "DELETE"){
    //PATH /user
    if(path === "/user"){
      const user = await req.json();
      if(!user.email) return new Response("Bad request", {status: 400}); //Compruebo si el parametro existe
      else{
        const usuario = usuarios.find((elem: User) => elem.email === user.email);
        if(usuario){
          usuarios = usuarios.filter((elem: User) => elem !== usuario); //Si el usuario a borrar existe, "lo borro"
          return new Response("Usuario borrado", {status: 200});
        }
        else return new Response("Usuers not found", {status: 404}); //Si no existe devuelvo un 404
      }
    }
  }

  return new Response("Endpoint not found", {status: 404}); //Si el metodo es diferente, devuelvo un 404
}

Deno.serve({port: 3000}, handler);
