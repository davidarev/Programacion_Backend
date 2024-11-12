import { Collection } from "mongodb";
import { Cliente, ClienteModel, CocheModel, TelefonoModel, Coche, Telefono } from './types.ts';

export const fromModelToCliente = async(cliente: ClienteModel, collectionCoches: Collection<CocheModel>, /*collectionTelefonos: Collection<TelefonoModel>*/): Promise<Cliente> => {
    const coches = await collectionCoches.find({_id: {$in: cliente.coches}}).toArray();
    //const telefono = await collectionTelefonos.findOne({_id: {$in: cliente.telefono}});
    /*if(telefono === null){
        Deno.exit(1);
    }*/
    return {
        id: cliente._id!.toString(),
        nombre: cliente.nombre,
        apellido: cliente.apellido,
        edad: cliente.edad,
        dni: cliente.dni,
        coches: coches.map((c) => fromModelToCoche(c)),
        //telefono: fromModelToTelefono(telefono)
    }
}

export const fromModelToCoche = (coche: CocheModel): Coche => ({
    id: coche._id!.toString(),
    marca: coche.marca,
    modelo: coche.marca,
    matricula: coche.matricula
});

export const fromModelToTelefono = (telefono: TelefonoModel): Telefono => ({
    id: telefono._id!.toString(),
    marca: telefono.marca,
    modelo: telefono.marca,
    numero_serie: telefono.numero_serie
});