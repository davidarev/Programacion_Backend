import { ObjectId, OptionalId } from "mongodb";

export type ModelLibro = OptionalId<{
    titulo: string,
    autores: ObjectId[],
    copias: string,
}> 

export type ModeloAutor = OptionalId<{
    nombre: string,
    biografia: string,
}>

export type Libro = {
    id: string,
    titulo: string,
    autores: Autor[],
    copias: string,
}

export type Autor = {
    id: string,
    nombre: string,
    biografia: string,
}