import { Collection, ObjectId } from "mongodb";
import { APIPhone, APIWorldTime, ContactoModel } from "./types.ts";
import { GraphQLError } from "graphql";

type Context = {
    coleccionContactos: Collection<ContactoModel>
}

type GetContactParams = {
    id: string
}

type AddContactParams = {
    name: string,
    last_name: string,
    phone: string
}

type DeleteContactParams = {
    id: string
}

export const resolvers = {
    Query: {
        getContacts: async (_: unknown, __: unknown, contexto: Context): Promise<ContactoModel[]> => {
            const contactos = await contexto.coleccionContactos.find().toArray();
            return contactos;
        },
        getContact: async (_: unknown, params: GetContactParams, contexto: Context): Promise<ContactoModel | null> => {
            const contacto = await contexto.coleccionContactos.findOne({_id: new ObjectId(params.id)});
            return contacto;
        },
    },
    Mutation: {
        addContact: async (_: unknown, params: AddContactParams, contexto: Context): Promise<ContactoModel> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("Falta la API KEY de la API Ninja");

            const {name, last_name, phone} = params;
            const existsPhone = await contexto.coleccionContactos.countDocuments({phone});
            if(existsPhone >= 1) throw new GraphQLError("El telefono introducido ya existe en la BBDD");

            const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`;
            const data = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY,
                }
            });
            if(data.status !== 200) throw new GraphQLError("Error al acceder a la data de la API");

            const response: APIPhone = await data.json();
            if(response.is_valid === false) throw new GraphQLError("El telefono introducido es incorrecto");
            const country = response.country;
            const timezone = response.timezones[0];

            const {insertedId} = await contexto.coleccionContactos.insertOne({
                name, last_name, phone, country, timezone
            });

            return {
                _id: insertedId,
                name, last_name, phone, country, timezone
            }
        },
        deleteContact: async (_: unknown, params: DeleteContactParams, contexto: Context): Promise<Boolean> => {
            const {deletedCount} = await contexto.coleccionContactos.deleteOne({_id: new ObjectId(params.id)});
            return deletedCount === 1;
        }
    },
    Contacto: {
        id: (parent: ContactoModel): string => parent._id!.toString(),
        date: async (parent: ContactoModel): Promise<string> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("Falta la API KEY de la API Ninja");

            const url = `https://api.api-ninjas.com/v1/worldtime?timezone=${parent.timezone}`;
            const data = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY,
                }
            });
            if(data.status !== 200) throw new GraphQLError("Error al acceder a la data de la API");

            const response: APIWorldTime = await data.json();
            const date = response.datetime;

            return date;
        }
    }
}