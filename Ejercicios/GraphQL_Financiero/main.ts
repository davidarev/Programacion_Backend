import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { MongoClient } from "mongodb";
import { schema } from "./schema.ts";
import { resolvers } from "./resolver.ts";
import { BancoModel, UsuarioModel } from "./types.ts";

//Compruebo que existe el driver de MongoDB para conectarme a la BBDD
const MONGO_URL = Deno.env.get("MONGO_URL")
if(!MONGO_URL) throw new Error("Falta la URL del driver de MongoDB");

//Creo el cliente de MongoDb y lo conecto
const client = new MongoClient(MONGO_URL);
await client.connect();

//Indico la BBDD y las colecciones de datos de la misma
export const db = client.db("financiero");
const coleccionUsuarios = db.collection<UsuarioModel>("usuarios");
const coleccionBancos = db.collection<BancoModel>("bancos");

//Creo el servidor de Apollo
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
    context: async() => ({coleccionUsuarios, coleccionBancos}),
    listen: { port: 4000 },
});

console.log(`Servidor corriendo en: ${url}`);