import { MongoClient } from 'mongodb';
import { ContactoModel } from "./types.ts";
import { resolvers } from "./resolvers.ts";
import { schema } from "./schema.ts";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL) throw new Error("Falta la URL del driver de MongoDB");

const clienteMongo = new MongoClient(MONGO_URL);
await clienteMongo.connect();

const db = clienteMongo.db("EJEMPLO_GRAPHQL");
const coleccionContactos = db.collection<ContactoModel>("contacto");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({coleccionContactos}),
  listen: { port: 8000 },
});

console.log(`Server running on: ${url}`);