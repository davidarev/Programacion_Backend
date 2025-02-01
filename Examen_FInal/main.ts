import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema.ts";
import { resolvers } from "./resolvers.ts";
import {MongoClient} from "mongodb"
import { RestauranteModel } from "./types.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");
if(!MONGO_URL) throw new Error("Falta la URl del driver de MOngoDB")

const clienteMongo = new MongoClient(MONGO_URL);
await clienteMongo.connect();

const db = clienteMongo.db("examen_final");
const colectionRestaurantes = db.collection<RestauranteModel>("restaurantes");

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({colectionRestaurantes}),
  listen: { port: 8000 },
});

console.log(`Server running on: ${url}`);
