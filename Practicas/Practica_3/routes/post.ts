import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
//import { v4 } from "https://deno.land/std@$STD_VERSION/uuid/mod.ts"; //v4 es para generar un id aleatorio
import { AuthorSchema, BookSchema, UserSchema} from "../db/schemas.ts";
import { Author, Book,User } from "../types.ts";
import { AuthorCollection, booksCollection,UserCollection } from "../db/mongo.ts";
import { ExisteIdAuthor, ExisteIdUser, getAuthorBook } from "./extra.ts";

type PostAddUserContext = RouterContext< "/addUser",
    Record<string | number, string | undefined>,
    Record<string, any>
>;
type PostAddBooksContext=RouterContext<"/addBook", Record<string | number, string | undefined>, Record<string, any>>
type PostAddAuthor=RouterContext<"/addAuthor", Record<string | number, string | undefined>, Record<string, any>>

export const PostUser=async (context:PostAddUserContext)=>{
    try {
        const result=context.request.body({type:"json"});
        const value=await result.value;
        if(!value?.name||!value?.email||!value?.password){ //Si no existe el nombre, email o password
            context.response.body=("No se han introducido todos los datos");
            console.error("No se han introducido todos los datos");
            context.response.status=400;
            return;
        }
        const cifrarPassword = (password: string) => { //Funcion para cifrar la contraseña
            let cifrado = "";
            for (let i = 0; i < password.length; i++) { //Recorremos la contraseña
                cifrado += String.fromCharCode(password.charCodeAt(i) + 1);  //Ciframos la contraseña
            }
            return cifrado;
        }
        const passwordCifrada = cifrarPassword(value.password); //Ciframos la contraseña
        const user:Partial<User>={
            name:value.name,
            email:value.email,
            password: passwordCifrada, //Guardamos la contraseña cifrada
            createAt: new Date().toString(), //Guardamos la fecha de creacion y la convertimos a string
            cart:[""]
        }

        const id=await UserCollection.insertOne(user as UserSchema);
        context.response.body={ //Mostramos los datos del usuario
            id:user.id,
            nombre:user.name,
            email:user.email,
            password:user.password,
            createdAt: user.createAt,
            cart:user.cart
        }
    } catch (error) {
     throw error 
    }
}


export const postAuhor=async(context:PostAddAuthor)=>{ //añadir autor
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.name ) { //Si no existe el nombre
            context.response.body=("No se han introducido todos los datos");
            console.error("No se han introducido todos los datos");
            context.response.status = 400;
            return;
        }
        const author:Partial<Author>={
            name:value.name,
            books:[""]
        }
        const id = await AuthorCollection.insertOne(author as AuthorSchema);
        author.id = id.toString(); //Convertimos el id a string
        context.response.body = { //Mostramos los datos del autor
            id: author.id,
            name: author.name,
            books: author.books
        };
    } catch (error) {
      throw error
    }
}


export const postBooks = async (context: PostAddBooksContext) => { //añadir libro
    try {
        const result = context.request.body({ type: "json" });
        const value = await result.value;
        if (!value?.title || !value?.author||!value?.pages) { //Si no existe el titulo, autor o paginas
            context.response.body=("No se han introducido todos los datos");
            console.error("No se han introducido todos los datos");
            context.response.status = 400;
            return;
        }
        const authores=value.author;

        if(await ExisteIdAuthor(authores)){ //comprobamos que el autor existe
          /*const UUID = crypto.randomUUID(); //generamos un id aleatorio
          const isV4 = v4.validate(UUID); //comprobamos que el id es valido*/
          const book: Partial<Book> = {
            title: value.title,
            author: value.author,
            pages:value.pages,
            ISBN:"12354"//aqui deberia ir el isV4 que esta comentado en la linea 86. No funciona el import de la linea 2 te lo hemos dejado comentado para que compile
          };
          const id = await booksCollection.insertOne(book as BookSchema);
          book.id = id.toString(); //Convertimos el id a string

          const librosAuhtor:[string]|undefined=await getAuthorBook(authores); //obtenemos los libros del autor
          librosAuhtor?.push(book.id) //añadimos el libro al autor

          context.response.body = { //Mostramos los datos del libro
            id: book.id,
            title: book.title,
            author: book.author,
            pages:book.pages,
            ISBN: book.ISBN

          };
        }else{
          context.response.body=("El author no existe, cree el id del author primero");
        }
    } catch(error) {
     throw error; 
    }
};