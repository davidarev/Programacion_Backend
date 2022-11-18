
import {
    MongoClient,
    Database,
  } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
  import { AuthorSchema, BookSchema, UserSchema } from "./schemas.ts";
  
  const connectMongoDB = async (): Promise<Database> => {
    
    const mongo_url = "mongodb+srv://buscalo:encopilot@cluster0.zm5cfu0.mongodb.net/hagocopypastedelcod?authMechanism=SCRAM-SHA-1";
  
    const client = new MongoClient();
    await client.connect(mongo_url);
    const db = client.database("practica3");
    return db;
  };
  
  const db = await connectMongoDB();
  
  export const booksCollection = db.collection<BookSchema>("Books");
  export const UserCollection=db.collection<UserSchema>("User");
  export const AuthorCollection=db.collection<AuthorSchema>("Author");