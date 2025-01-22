import { Collection, ObjectId } from "mongodb";
import { UsuarioModel } from "./types.ts";
import { GraphQLError } from "graphql";
import { APIIban } from "./types.ts";
import { APIZipCode } from "./types.ts";

type Contexto = {
    coleccionUsuarios: Collection<UsuarioModel>
}

type GetUsuariosParams = {
    name: string,
    bank: string,
    country: string,
}

type GetUsuarioParams = {
    iban: string,
}

type DeleteUsuarioParams = {
    id: string,
}

type AddUsuarioParams = {
    name: string,
    iban: string,
    zip_code: string,
}

export const resolvers = {
    Query: {
        getUsuarios: async (_:unknown, params: GetUsuariosParams, contexto: Contexto): Promise<UsuarioModel[]> => {
            const usuarios = await contexto.coleccionUsuarios.find(params).toArray();
            return usuarios;
        },
        getUsuario: async (_:unknown, params: GetUsuarioParams, contexto: Contexto): Promise<UsuarioModel | null> => {
            const usuario = await contexto.coleccionUsuarios.findOne({iban: params.iban});
            return usuario;
        }
    },
    Mutation: {
        addUsuario: async (_: unknown, params: AddUsuarioParams, contexto: Contexto): Promise<UsuarioModel> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("Falta la API_KEY de la API Ninja");

            const {name, iban, zip_code} = params;
            const existsIban = await contexto.coleccionUsuarios.countDocuments({iban});
            if(existsIban >= 1) throw new GraphQLError("El IBAN introducido ya existe");
            const existsZipCode = await contexto.coleccionUsuarios.countDocuments({zip_code});
            if(existsZipCode >= 1) throw new GraphQLError("El ZIP Code introducido ya existe");

            const url_iban = `https://api.api-ninjas.com/v1/iban?iban=${iban}`;
            const data_iban = await fetch(url_iban, {
                headers:{
                    'X-Api-Key': API_KEY,
                }
            });
            if(data_iban.status !== 200) throw new GraphQLError("ERROR (IBAN DATA)");
            const response_iban: APIIban = await data_iban.json();
            if(response_iban.valid === false) throw new GraphQLError("El IBAN es incorrecto");
            const country_bank = response_iban.country;
            const bank = response_iban.bank_name;

            const url_zipcode = `https://api.api-ninjas.com/v1/zipcode?zip=${zip_code}`;
            const data_zipcode = await fetch(url_zipcode, {
                headers:{
                    'X-Api-Key': API_KEY,
                }
            });
            if(data_zipcode.status !== 200) throw new GraphQLError("ERROR (ZIP CODE DATA)");
            const response_zipcode: APIZipCode = await data_zipcode.json();
            if(response_zipcode.valid === false) throw new GraphQLError("El ZIP Code es incorrecto");
            const country = response_zipcode.country;
            const city = response_zipcode.city;

            const {insertedId} = await contexto.coleccionUsuarios.insertOne({
                name,
                iban,
                bank,
                country_bank,
                zip_code,
                city,
                country,
            });

            return {
                _id: insertedId,
                name,
                iban,
                bank,
                country_bank,
                zip_code,
                city,
                country,
            }
        },
        deleteUsuario: async (_: unknown, params: DeleteUsuarioParams, contexto: Contexto): Promise<boolean> => {
            const {deletedCount} = await contexto.coleccionUsuarios.deleteOne({_id: new ObjectId(params.id)});
            return deletedCount === 1;
        }
    },
    Usuario: {
        id: (parent: UsuarioModel): string => parent._id!.toString(),
    }
}