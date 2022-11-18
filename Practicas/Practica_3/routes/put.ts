import {  ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserCollection } from "../db/mongo.ts";
import { ExisteIdBook, ExisteIdUser, getBooks } from "./extra.ts";

type PutCarContext=RouterContext<"/updateCar", Record<string | number, string | undefined>, Record<string, any>>

export const PutCar = async (context: PutCarContext) => {
    try {
        const result=context.request.body({type:"json"});
        const value=await result.value;
        if(!value?.id_user || !value?.id_book){ //Si no existe el id del usuario o el id del libro
            context.response.status=400;
            return;
        }
        const id_user=value.id_user;
        const id_book=value.id_book;

        if(await ExisteIdUser(id_user)===true && await ExisteIdBook(id_book)===true){ //Si existe el id del usuario y el id del libro
            const librosUser:[string]|undefined=await getBooks(id_user);
            librosUser?.push(id_book) //Añadir el id del libro al array de libros del usuario
            const count=await UserCollection.updateOne({ //Actualizar el array de libros del usuario
                _id:new ObjectId(id_user)
            },{
                $set:{
                    cart:librosUser
                }
            })
            if(count){
                const user=await UserCollection.findOne({
                    _id:new ObjectId(id_user)
                });
                context.response.body={ //Devolver el usuario con el array de libros actualizado
                    id:user?._id,
                    name:user?.name,
                    password:user?.password,
                    createAt:user?.createAt,
                    cart:user?.cart
                };
            }else{
                context.response.status=400;
            }
        }
    } catch (error) {
        throw error;
    }
}
