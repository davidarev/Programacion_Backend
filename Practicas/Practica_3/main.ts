import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { deleteUser } from "./routes/delete.ts";

import { getBook, getUser } from "./routes/get.ts";
import { postAuhor, postBooks, PostUser,  } from "./routes/post.ts";
import { PutCar } from "./routes/put.ts";


const router = new Router();

router
    .post("/addUser",PostUser) //Endpoint para agregar un usuario
    .post("/addBook",postBooks) //Endpoint para agregar un libro
    .post("/addAuthor",postAuhor) //Endpoint para agregar un autor
    .delete("/deleteUser/:id",deleteUser) //Endpoint para eliminar un usuario
    .get("/getUser/:id",getUser) //Endpoint para obtener un usuario
    .put("/updateCar",PutCar) //Endpoint para actualizar un usuario
    .get("/getBook/:info",getBook) //Endpoint para obtener un libro
    const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
