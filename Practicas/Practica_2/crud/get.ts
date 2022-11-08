// A la hora de la verdad no hemos utilizado este archivo, el la funcion get está desarrollada dentro del propio main.

import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { UserCollection } from "../db/mongo.ts";
import { UserSchema } from "../db/schemas.ts";
import { User } from "../types.ts";
type GetUserContex=RouterContext<"getUser/:id", {
    id: string;
    dni:string;
    telefono: string;
    email:string;
    iban:string;
} & Record<string | number, string | undefined>, Record<string, any>>

export const getUser=async(ctx:GetUserContex)=>{
    const result = ctx.request.body({type:"json"});
    const value = await result.value;
    if(!value?.email || !value?.telefono || !value?.dni || !value?.id || !value?.iban
        /*{$or: [!value?.email, !value?.telefono, !value?.dni, !value?.id, !value?.iban]}*/){
        ctx.response.body = "El campo de busqueda es incorrecto";
        console.error("El campo de busqueda es incorrecto. Introduzca un correo, un telefeno, un DNI, un id o un IBAN");
        
        ctx.response.status = 404;
        return;
    }
    else{
        if(value.email){
            ctx.response.body = "Campo de busqueda: Email";
            //ctx.response.status = 201;
        }
        if(value.telefono){
            ctx.response.body = "Campo de busqueda: Telefono";
            //ctx.response.status = 201;
        }
        if(value.dni){
            ctx.response.body = "Campo de busqueda: DNI";
            //ctx.response.status = 201;
        }
        if(value.id){
            ctx.response.body = "Campo de busqueda: id";
            //ctx.response.status = 201;
        }
        if(value.iban){
            ctx.response.body = "Campo de busqueda: IBAN";
            //ctx.response.status = 201;
        }
        const user:Partial<User>={
            dni:value.dni,
            nombre:value.nombre,
            apellido:value.apellido,
            telefono: value.telefono,
            email:value.email,
            iban:value.iban
        }
        const id=await UserCollection.insertOne(user as UserSchema);
        user.id=id.toString();
        ctx.response.body={
            id:user.id,
            nombre:user.nombre,
            dni:user.dni,
            apellido:user.apellido,
            telefono:user.telefono,
            email:user.email,
            iban:user.iban
        }
        if(user) {
            ctx.response.body = user;
            ctx.response.status = 200;
            return;
        }
    }

}