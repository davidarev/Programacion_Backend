import { Collection } from "mongodb";
import { ModelLibro, Libro } from './types.ts';
import { ModeloAutor, Autor } from "./types.ts";

export const fromModelToLibro = async (libro: ModelLibro, coleccionAutores: Collection<ModeloAutor>): Promise<Libro> => {
    const autores = await coleccionAutores.find({_id: libro.autores}).toArray();
    return {
        id: libro._id!.toString(),
        titulo: libro.titulo,
        copias: libro.copias,
        autores: autores.map((a) => fromModelToAutor(a)),
    }
};

export const fromModelToAutor = (autor: ModeloAutor): Autor => ({
    id: autor._id!.toString(),
    nombre: autor.nombre,
    biografia: autor.biografia,
});