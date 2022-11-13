// deno-lint-ignore-file prefer-const
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { postUser } from "./crud/post.ts"; 
import { deleteUser } from "./crud/delete.ts";
import { getUser } from "./crud/get.ts";
import { User } from "./types.ts";

const router=new Router();
let users:User[]=[];
router
.get("/getUser/:user", (context)=>{ //Este metodo no funciona
  if (context.params?.user) {
     const user: User | undefined = users.find(
       (user) => (user.email || user.dni || user.telefono || user.iban || user.id) === context.params.user
     );
     if (user) {
        context.response.body = user;
        context.response.status = 200;
        return;
      }
    }
    context.response.body = "usuario no encontrado";
    context.response.status = 404;
})
  .post("/addUser",postUser)
  .delete("/deleteUser/:email",deleteUser)
  //lo de addTransition no se que metodo es
  
const app=new Application();
app.use(router.routes());
app.use(router.allowedMethods());
await app.listen({port:7777});


