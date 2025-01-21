import { Collection, ObjectId } from "mongodb";
import { ContactoModel, APIPhone, APIWorldTime } from "./types.ts";
import { GraphQLError, responsePathAsArray } from 'graphql';
import { graphql } from "graphql";

type Contexto = {
    coleccionContactos: Collection<ContactoModel>,
}

type GetContactoParams = {
    id: string,
}

type DeleteContactoParams = {
    id: string,
}

type AddContactoParams = {
    name: string,
    phone: string,
}

export const resolvers = {
    Query: {
        getContactos: async (_: unknown, __: unknown, contexto: Contexto): Promise<ContactoModel[]> => {
            const contactos = await contexto.coleccionContactos.find().toArray();
            return contactos;
        },
        getContacto: async (_: unknown, params: GetContactoParams, contexto: Contexto): Promise<ContactoModel | null> => {
            const contacto = await contexto.coleccionContactos.findOne({_id: new ObjectId(params.id)});
            return contacto;
        }
    },
    Mutation: {
        addContacto: async (_: unknown, params: AddContactoParams, contexto: Contexto): Promise<ContactoModel> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("Error con la API_KEY de Api Ninja");

            const {name, phone} = params;

            const ExistePhone = await contexto.coleccionContactos.countDocuments({phone});
            if(ExistePhone >= 1) throw new GraphQLError("El telefono ya existe");
            const url_phone = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`
            const data_phone = await fetch(url_phone, {
                headers: {
                    'X-Api-Key': API_KEY,
                }
            })
            if(data_phone.status !== 200) throw new GraphQLError("ERROR")
            const response_phone: APIPhone = await data_phone.json();
            if(!response_phone.is_valid) throw new GraphQLError("El telefono no es valido");
            const country = response_phone.country;
            const timezone = response_phone.timezones[0];

            const url_worldtime = `https://api.api-ninjas.com/v1/worldtime?timezone=${timezone}`
            const data_worldtime = await fetch(url_worldtime, {
                headers: {
                    'X-Api-Key': API_KEY,
                }
            })
            if(data_phone.status !== 200) throw new GraphQLError("ERROR")
            const response_worldtime: APIWorldTime = await data_worldtime.json();
            const created = response_worldtime.datetime;

            const {insertedId} = await contexto.coleccionContactos.insertOne({
                name,
                phone,
                country,
                timezone,
                created,
            });

            return {
                _id: insertedId,
                name,
                phone,
                country,
                timezone,
                created,
            }
        },
        deleteContacto: async (_: unknown, params: DeleteContactoParams, contexto: Contexto): Promise<boolean> => {
            const {deletedCount} = await contexto.coleccionContactos.deleteOne({_id: new ObjectId(params.id)});
            return deletedCount === 1;
        }
    },
    Contacto: {
        id: (parent: ContactoModel): string => parent._id!.toString(),
        datetime: async (parent: ContactoModel): Promise<string> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("Error con el API_KEY de la API Ninja");

            const timezone = parent.timezone;
            const url = `https://api.api-ninjas.com/v1/worldtime?timezone=${timezone}`
            const data = await fetch(url, {
                headers: {
                    'X-Api-Key': API_KEY,
                }
            });
            if(data.status !== 200) throw new GraphQLError("ERROR");

            const response: APIWorldTime = await data.json();
            const time = response.datetime;
            return time;
        }
    }
}