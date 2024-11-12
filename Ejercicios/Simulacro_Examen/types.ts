import {ObjectId, type OptionalId} from "mongodb";

export type ClienteModel = OptionalId<{
    nombre: string, 
    apellido: string,
    edad: string,
    dni: string,
    coches: ObjectId[],
    //telefono: ObjectId
}>;

export type CocheModel = OptionalId<{
    marca: string, 
    modelo: string,
    matricula: string,
}>;

export type TelefonoModel = OptionalId<{
    marca: string, 
    modelo: string,
    numero_serie: string
}>;

export type Cliente = {
    id: string,
    nombre: string, 
    apellido: string,
    edad: string,
    dni: string,
    coches: Coche[],
    //telefono: Telefono
};

export type Coche = {
    id: string,
    marca: string, 
    modelo: string,
    matricula: string,
};

export type Telefono = {
    id: string,
    marca: string, 
    modelo: string,
    numero_serie: string
};