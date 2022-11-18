
import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import {  booksCollection, UserCollection } from "../db/mongo.ts";
import { BookSchema, UserSchema } from "../db/schemas.ts";

type GetUserContext=RouterContext<"/getUser/:id", {
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>

export const getUser=async (contex:GetUserContext)=>{
    try {
        if(contex.params?.id){ //Comprobar si el id del usuario existe
            const user:UserSchema|undefined=await UserCollection.findOne({
                _id:new ObjectId(contex.params.id)
            });
            if(user){ //Si existe el usuario
                contex.response.body=user; //Mostrar el usuario
                return
            }
        }
        contex.response.status=404;
    } catch (error) {
        throw error
    }
}


type GetBookContext=RouterContext<"/getBook/:info", {
    info: string;
} & Record<string | number, string | undefined>, Record<string, any>>;

export const getBook = async (context: GetBookContext) => {
   try {
    if (context.params?.page && context.params?.title) { //si la pagina y el titulo existen
        const book = await booksCollection
            .find({title:context.params.title}) //buscamos el libro con el titulo
            .limit(10) // limitamos a 10
            .skip(parseInt(context.params.page)*10); // saltamos los 10 primeros libros de la pagina anterior (si es la primera pagina no saltamos ninguno)
        if (book) { // si existe el libro
            context.response.body = book;  // devolvemos el libro
            context.response.status = 200;
        } else {
            context.response.body = "El libro no existe";
            console.error("El libro no existe");
            context.response.status = 404;
        }
    } else { // si se introduce un parametro incorrecto
        context.response.body = "El campo de busqueda es incorrecto";
        console.error("El campo de busqueda es incorrecto");
        context.response.status = 404;
    }
   } catch (error) {
    throw error
   }
}