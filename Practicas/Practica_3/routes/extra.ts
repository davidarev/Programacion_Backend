/*He creado este archivo ya que no he sido capaz de comprobar que hay un usuario un libro o un autor a la hora de crear otra funcion.
Me explico en la funcion addBook habria que comprobar si el author existe. Como no soyy capaz de hacerlo directamente en esas funciones
he pensado en hacerlo por separado y hacerlo en una funcion a parte.Espero que este apaño no me baje mucho ya que lo voy a usar en
 dos funciones las cuales son AddUser y UpdateCart
*/

import { Database, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";

import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import {  AuthorCollection, booksCollection, UserCollection } from "../db/mongo.ts";
import { AuthorSchema, BookSchema, UserSchema } from "../db/schemas.ts";


export const ExisteIdUser=async(id_user:any)=>{
    try { //Comprobar si el id del usuario existe
        if(id_user){
            const user:UserSchema|undefined=await UserCollection.findOne({
                _id:new ObjectId(id_user)
            })
            if (user){
                return true;
            }else{
                return false
            }
        }
    } catch (error) { //Si no existe el id
        console.error("El user no existe, cree el id del user primero");
        
    }
}
export const ExisteIdAuthor= async(id_author:string)=>{
   try { //Comprobar si el id del autor existe
    if(id_author){   
        const author:AuthorSchema|undefined=await AuthorCollection.findOne({
            _id:new ObjectId(id_author)
        })
        if(author){
            return true;
        }else{
            return false
        }
    }
} catch (error) {
    console.error("El author no existe, cree el id del author primero");
}
}

export const ExisteIdBook=async (id_book:string):Promise<boolean>=>{
    try { //Comprobar si el id del libro existe
       
            const book:BookSchema|undefined=await booksCollection.findOne({
                _id:new ObjectId(id_book)
            })
            if(book){
                return true
            }
                
                return false
            
        
    } catch (e) {
        console.error("El id del libro no existe, cree el id del libro primero");
        throw e;
        
    }
}


export const getBooks=async(id_user:string)=>{
    try {
       
            const user:UserSchema|undefined=await UserCollection.findOne({
                _id:new ObjectId(id_user)
            })
            if(user){
                return  user.cart
            }
        
    } catch (error) {
        
        throw error;
    }
}

export const getAuthorBook=async(id_author:string)=>{
    try {
        const author:AuthorSchema|undefined=await AuthorCollection.findOne({
            _id:new ObjectId(id_author)
        })
        if(author)return author.books
    } catch (error) {
        throw error
    }
}
/*
export const IdBokenLibreria=(id_book:string,libreria:[string])=>{
    //const flat=arr2.reduce((acc:number[],elem:number[])=>[...acc,...elem],[])
    const esta=libreria.reduce((libro:string,elem:[string])=>{
        libro=id_book;
        elem.at[]
    })
}*/
//hacer una funcion que haga un reduce para comprobar si el id del libro esta dentro de la libreria
 
