import { GraphQLError } from 'graphql';
import { Collection, ObjectId } from 'mongodb';
import { APIIBAN, BancoModel, UsuarioModel } from "./types.ts";

//TIPOS DE DATOS A MODO DE PARAMETROS Y CONTEXTOS
//Colecciones de datos de la BDD
type Contexto = {
    coleccionUsuarios: Collection<UsuarioModel>,
    coleccionBancos: Collection<BancoModel>,
}

//Parametros cuando de pide un banco
type GetBancoParams = {
    id: string,
}

//Parametros cuando de crea un usuario
type AddUsuarioParams = {
    name: string,
    iban: string,
    zip_code: string,
}

//Parametros cuando de pide un banco
type AddBancoParams = {
    name: string,
}

//Resolvers
export const resolvers = {
    Query: {
        //Query para devolver todos los usuarios existentes
        GetUsuarios: async (_: unknown, __: unknown, contexto: Contexto): Promise<UsuarioModel[]> => {
            const usuarios = await contexto.coleccionUsuarios.find().toArray();
            return usuarios;
        },
        //Query para devolver todos los bancos existentes
        GetBancos: async (_: unknown, __: unknown, contexto: Contexto): Promise<BancoModel[]> => {
            const bancos = await contexto.coleccionBancos.find().toArray();
            return bancos;
        },
        //Query para devolver un banco existente mediante su ID de MongoDB
        GetBanco: async (_: unknown, params: GetBancoParams, contexto: Contexto): Promise<BancoModel | null> => {
            const banco = await contexto.coleccionBancos.findOne({_id: new ObjectId(params.id)});
            return banco;
        }
    },
    
    Mutation: {
        //Mutacion para crear/añadir un usuario a la BBDD
        AddUsuario: async (_: unknown, params: AddUsuarioParams, contexto: Contexto): Promise<UsuarioModel> => {
            //Compruebo que existe el API_KEY para explotar los datos de la API Ninja
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("Falta la API_KEY de Ninja");

            //Compruebo si existe el IBAN introducido como parametro
            const {name, iban, zip_code} = params;
            const ExistsIBAN = await contexto.coleccionUsuarios.countDocuments({iban});
            if(ExistsIBAN >= 1) throw new GraphQLError("El IBAN introducido ya existe");

            //Obtengo la data de la API Ninja y verifico su estatus
            const url = `https://api.api-ninjas.com/v1/iban?iban=${iban}`;
            const data = await fetch(url, {
                headers: { 
                    "X-Api-Key": API_KEY,
                }
            });
            if(data.status !== 200) throw new GraphQLError("ERROR");

            //Compruebo la data extraida respecto al IBAN introducido como parametro
            const response: APIIBAN = await data.json();
            const bank_name = response.bank_name;
            if (!bank_name) throw new GraphQLError("No se pudo determinar el banco desde el IBAN proporcionado");

            //Busco si en la BBDD hay un banco con el mimso nombre que el nombre del banco extraido de la data 
            const banco = await contexto.coleccionBancos.findOne({name: bank_name});
            if (!banco) throw new GraphQLError("Banco no encontrado");
            const banco_id = new ObjectId(banco._id);

            //Creo un nuevo usuario con sus atributos
            const {insertedId} = await contexto.coleccionUsuarios.insertOne({
                name, iban, zip_code, banco_id
            });

            //Actualizo el array de usuarios del banco correspondientes, añadiendo el ID del usuario
            await contexto.coleccionBancos.updateOne(
                {_id: banco_id}, 
                {$push: {usuarios: insertedId}}
            );

            //Devuelvo el nuevo usuario
            return {
                _id: insertedId,
                name, iban, zip_code, banco_id
            }
            },

        //Mutuacion para crear/añadir un banco la BBDD
        AddBanco: async (_: unknown, params: AddBancoParams, contexto: Contexto): Promise<BancoModel> => {
            const {name} = params;

            //Compruebo si existe el nombre introducido como parametro
            const ExistsName = await contexto.coleccionUsuarios.countDocuments({name});
            if(ExistsName >= 1) throw new GraphQLError("El nombre del banco introducido ya existe");

            //Creo un nuevo banco con sus atributos
            const usuarios: ObjectId = []
            const {insertedId} = await contexto.coleccionBancos.insertOne({
                name,
                usuarios,
            });

            //Devuelvo el nuevo banco
            return {
                _id: insertedId,
                name,
                usuarios
            }
            },
    },

    //Siempre que se devuelva un usuario, se mapearan estos atributos
    Usuario: {
        id: (parent: UsuarioModel): string => parent._id!.toString(),
        banco_id: (parent: UsuarioModel): string => parent.banco_id!.toString(),
    },

    //Siempre que se devuelva un banco, se mapearan estos atributos
    Banco: {
        id: (parent: BancoModel): string => parent._id!.toString(),
    }
  };