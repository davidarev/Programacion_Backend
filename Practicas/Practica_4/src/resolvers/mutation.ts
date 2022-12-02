import { ObjectId } from "mongo";
import { cocheCollection, vendoresCollection,concesionarioCollection } from "../db/dbconnection.ts";
import { VendedorSchem } from "../db/schema.ts";
import { Coche, Concesionario, Vendedor } from "../types.ts";

export const Mutation = {
  CrearCoche: async ( _: unknown,
    args: { matricula:string;color:string;puertas:number;modelo:string;marca:string;precio:number }
  ): Promise<Coche> => {
    try {
      const exists = await cocheCollection.findOne({ matricula: args.matricula });
      if (exists) {
        throw new Error("El coche ya existe");
      }


      const car = await cocheCollection.insertOne({
        matricula:args.matricula,
        color:args.color,
        puertas:args.puertas,
        modelo:args.modelo,
        marca:args.marca,
        precio:args.precio
      });
      return {
        id: car.toString(),
        matricula:args.matricula,
        color:args.color,
        puertas:args.puertas,
        modelo:args.modelo,
        marca:args.marca,
        precio:args.precio
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  CrearVendedor:async(_:unknown,
    args:{nombre:string,apellido:string,telefono:string,correo:string}):Promise<Vendedor>=>{
      try {
        const exists=await vendoresCollection.findOne({correo:args.correo});
        if(exists){
          throw new Error("El vendedor ya existe")
        }
        const vendedor=await vendoresCollection.insertOne({
          nombre:args.nombre,
          apellido:args.apellido,
          telefono:args.telefono,
          correo:args.correo,
          coches:['']
        })
        return{
          id:vendedor.toString(),
          nombre:args.nombre,
          apellido:args.apellido,
          telefono:args.telefono,
          correo:args.correo
        }

      } catch (error) {
        throw new Error(error)
      }
    },
    CrearConcesionario:async(_:unknown,
      args:{nombre:string,pais:string,telefono:string,nombre_dueno:string,precio:number}):Promise<Concesionario>=>{
        try {
          const exists=await concesionarioCollection.findOne({telefono:args.telefono});
          if(exists){
            throw new Error("El concesionario ya existe");
          }
          const concesionario=await concesionarioCollection.insertOne({
            nombre:args.nombre,
            pais:args.pais,
            telefono:args.telefono,
            nombre_dueno:args.nombre_dueno,
            vendedores:[''],
            
          })
          return{
            id:concesionario.toString(),
            nombre:args.nombre,
            pais:args.pais,
            telefono:args.telefono,
            nombre_dueno:args.nombre_dueno,
            

          }
        } catch (error) {
          throw new Error(error)
        }
      },
      anadirCocheVendedor:async(_:unknown,
        args:{id_coche:string,id_vendedor:string}):VendedorSchem|undefined=>{
         try {
          
          const coche=await cocheCollection.findOne({_id:new ObjectId(args.id_coche)});
          const vendedor=await vendoresCollection.findOne({_id:new ObjectId(args.id_vendedor)});
          if(!coche){
            throw new Error("El id del coche no es correcto")
          }else if(!vendedor){
            throw new Error("El id del vendedor no es correcto")
          }
            const cochesVendedor=vendedor.coches;
           
          
         } catch (error) {
          throw new Error(error);
         } 
        }
      
 /* updateCar: async (
    _: unknown,
    args: { id: string; plate: string; brand: string; seats: number }
  ): Promise<Car> => {
    try {
      const car = await carsCollection.findOne({ _id: new ObjectId(args.id) });
      if (!car) {
        throw new Error("Car not found");
      }

      const updatedCar = await carsCollection.updateOne(
        { _id: new ObjectId(args.id) },
        {
          $set: {
            plate: args.plate,
            brand: args.brand,
            seats: args.seats,
          },
        }
      );
      return {
        id: updatedCar.upsertedId!.toString(),
        plate: args.plate,
        brand: args.brand,
        seats: args.seats,
      };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },
  deleteCar: async (_: unknown, args: { id: string }): Promise<Car> => {
    try {
      const car = await carsCollection.findOne({ _id: new ObjectId(args.id) });
      if (!car) {
        throw new Error("Car not found");
      }

      const deletedCar = await carsCollection.deleteOne({
        _id: new ObjectId(args.id),
      });
      return { ...car, id: car._id.toString() };
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  },*/
};
