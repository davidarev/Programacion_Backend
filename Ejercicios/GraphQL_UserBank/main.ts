import { MongoClient } from "mongodb";
import { UsuarioModel } from "./types.ts";
import { schema } from "./schema.ts";
import { resolvers } from "./resolver.ts";
import { ApolloServer } from "npm:@apollo/server";
import { startStandaloneServer } from "npm:@apollo/server/standalone";

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL) throw new Error("Falta la URL del driver de mongodb");

const mongocliente = new MongoClient(MONGO_URL);
await mongocliente.connect();

const db = mongocliente.db("EJEMPLO_GRAPHQL");
const coleccionUsuarios = db.collection<UsuarioModel>("usuarios_banco");

const server = new ApolloServer({
    typeDefs: schema,
    resolvers,
  });
  
  const { url } = await startStandaloneServer(server, {
    context: async () => ({coleccionUsuarios}),
    listen: { port: 8000 },
  });
  
  console.log(`Server running on: ${url}`);