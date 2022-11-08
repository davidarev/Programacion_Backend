import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { UserCollection } from "../db/mongo.ts";
type DeleteUserContext=RouterContext<"/deleteUser/:email", {
    email: string;
} & Record<string | number, string | undefined>, Record<string, any>>;
export const deleteUser=async(ctx:DeleteUserContext)=>{
    if(ctx.params?.email){
        const count=await UserCollection.deleteOne({
            email:ctx.params.email
        });
        if(count){
            ctx.response.status=200;
        }else{
            ctx.response.status=404;
        }
    };
    
}