import { Coche, Concesionario, Vendedor } from "../types.ts";
import { ObjectId } from "mongo";

export type CocheSchema = Omit<Coche, "id"> & {
  _id: ObjectId;
};
export type VendedorSchem=Omit<Vendedor,"id">&{
  _id:ObjectId,
 
}
export type ConcesionarioSchema=Omit<Concesionario,"id">&{
  _id:ObjectId,
  
}