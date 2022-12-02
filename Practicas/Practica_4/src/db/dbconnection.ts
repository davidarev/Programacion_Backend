import { MongoClient, Database } from "mongo";
import { CocheSchema,VendedorSchem,ConcesionarioSchema } from "./schema.ts";

import { config } from "std/dotenv/mod.ts";

await config({ export: true, allowEmptyValues: true });

const connectMongoDB = async (): Promise<Database> => {
  /*const mongo_usr = Deno.env.get("MONGO_USR");

  console.log(mongo_usr);
  
  const mongo_pwd = Deno.env.get("MONGO_PWD");
  const db_name = Deno.env.get("DB_NAME");
  const mongo_uri = Deno.env.get("MONGO_URI");

  if (!mongo_usr || !mongo_pwd || !db_name || !mongo_uri) {
    throw new Error(
      "Missing environment variables, check env.sample for creating .env file"
    );
  }
*/
const mongourl=`mongodb+srv://jnml:javier@cluster0.zm5cfu0.mongodb.net/practica4?authMechanism=SCRAM-SHA-1`

  const client = new MongoClient();
  await client.connect(mongourl);
  const db = client.database("practica4");
  return db;
};

const db = await connectMongoDB();
console.info(`MongoDB ${db.name} connected`);

export const cocheCollection = db.collection<CocheSchema>("Coche");
export const vendoresCollection=db.collection<VendedorSchem>("Vendedor");
export const concesionarioCollection=db.collection<ConcesionarioSchema>("Concesionario");