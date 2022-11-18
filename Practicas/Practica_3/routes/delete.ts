import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { UserCollection } from "../db/mongo.ts";

type DeleteUserContext = RouterContext<"/deleteUser/:id", {
    id: string;
} & Record<string | number, string | undefined>, Record<string, any>>

export const deleteUser=async (contex:DeleteUserContext)=>{
    try { //Comprobar si el id del usuario existe
        if(contex.params?.id){ //Si existe el id
            const count =await UserCollection.deleteOne({_id:new ObjectId(contex.params.id),}) //Borrar el id
            if(count){
                contex.response.status=200;
            }else{
                contex.response.status=400;
            }
        }
    } catch (error) {  //Si no existe el id
        throw error
    }



  
    
}