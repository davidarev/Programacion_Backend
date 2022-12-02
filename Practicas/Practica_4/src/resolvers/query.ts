import { cocheCollection,vendoresCollection } from "../db/dbconnection.ts";
import { ObjectId } from "mongo";
import { Coche, Vendedor } from "../types.ts";

export const Query = {
  
  getCar: async (_: unknown, args: { id: string }): Promise<Coche | undefined> => {
    try {
      const car = await cocheCollection.findOne({ _id: new ObjectId(args.id) });
      if (car) return { ...car, id: car._id.toString() };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
};
