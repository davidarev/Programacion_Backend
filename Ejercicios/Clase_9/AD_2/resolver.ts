import {Collection, ObjectId} from "mongodb";
import {VueloModelo, Vuelo} from "./type.ts";
import {fromModeloToVuelo} from "./utilities.ts";

export const resolvers = {
    Query: {
        getFlights: async (_: unknown, parametros: {origen: string, destino: string}, contexto: {coleccionVuelos: Collection<VueloModelo>}): Promise<Vuelo[]> => {            
            const vuelosModelos = await contexto.coleccionVuelos.find(parametros).toArray();
            return vuelosModelos.map((vuelo) => fromModeloToVuelo(vuelo));
        },
        getFlight: async (_: unknown, parametros: {id: string}, contexto: {coleccionVuelos: Collection<VueloModelo>}): Promise<Vuelo | null> => {
            const {id} = parametros;
            const vueloModelo = await contexto.coleccionVuelos.findOne({_id: new ObjectId(id)});
            if(!vueloModelo) return null;
            return fromModeloToVuelo(vueloModelo);
        },
    },
    Mutation: {
        addFlight: async (_: unknown, parametros: {origen: string, destino: string, fecha_hora: string}, contexto: {coleccionVuelos: Collection<VueloModelo>}): Promise<Vuelo> => {
            const {origen, destino, fecha_hora} = parametros;
            const {insertedId} = await contexto.coleccionVuelos.insertOne(parametros);
            const vuelo = {
                _id: insertedId,
                origen, destino, fecha_hora
            }
            return fromModeloToVuelo(vuelo);
        }
    }
}