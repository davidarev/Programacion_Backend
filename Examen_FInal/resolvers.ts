import { Collection, ObjectId } from "mongodb";
import { APICity, APIPhone, APIWeather, APIWorldTime, RestauranteModel } from "./types.ts";
import { GraphQLError } from "graphql";

//Tipos a modo de Contexto y Parametros a utilizar en los resolvers y las querys
type Contexto = {
    colectionRestaurantes: Collection<RestauranteModel>
}

type GetRestaurantsParams = {
    ciudad: string,
}

type GetRestaurantParams = {
    id: string,
}

type AddRestaurantParams = {
    nombre: string, 
    direccion: string, 
    ciudad: string, 
    telefono: string
}

type DeleteRestaurantParams = {
    id: string,
}

export const resolvers = {
    Query: {
        getRestaurants: async (_: unknown, params: GetRestaurantsParams, contexto: Contexto): Promise<RestauranteModel[]> => {
            const restaurantes = await contexto.colectionRestaurantes.find({ciudad: params.ciudad}).toArray();
            return restaurantes;
        },
        getRestaurant: async (_: unknown, params: GetRestaurantParams, contexto: Contexto): Promise<RestauranteModel | null> => {
            const restaurante = await contexto.colectionRestaurantes.findOne({_id: new ObjectId(params.id)});
            return restaurante;
        },
    },
    Mutation: {
        addRestaurant: async (_: unknown, params: AddRestaurantParams, contexto: Contexto): Promise<RestauranteModel> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("ERROR: No se ha proporcionado la API KEY de API Ninja");

            const {nombre, direccion, ciudad, telefono} = params;
            if(!nombre || !direccion || !ciudad || !telefono) throw new GraphQLError("ERROR: No se han introducido todos los parametros");
            const existeTelefono = await contexto.colectionRestaurantes.countDocuments({telefono});
            if(existeTelefono >= 1) throw new GraphQLError("ERROR: El telefono introducido ya existe");

            //API PHONE VALIDATE
            const url_phone = `https://api.api-ninjas.com/v1/validatephone?number=${telefono}`
            const data_phone = await fetch(url_phone, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });
            if(data_phone.status !== 200) throw new GraphQLError("ERROR: No se ha conectado correctamente a la API Validate Phone");
            const response_phone: APIPhone = await data_phone.json();
            if(response_phone.is_valid === false) throw new GraphQLError("ERROR: El telefono introducido no es valido");
            //Tomo el dato 'country' de esta API en lugar de la API City debido a que esta API devuelve el pais entero (Spain), mientras que API City devuelve (ES)
            const pais = response_phone.country; 

            //API City
            const url_city = `https://api.api-ninjas.com/v1/city?name=${ciudad}`
            const data_city = await fetch(url_city, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });
            if(data_city.status !== 200) throw new GraphQLError("ERROR: No se ha conectado correctamente a la API City");
            const response_city: APICity = await data_city.json();
            const latitud = response_city.latitude; //Por alguna razón, es valor es 'undefined'
            const longitud = response_city.longitude; //Por alguna razón, es valor es 'undefined'
            //console.log("Latitud: ", latitud); // --> Latitud: undefined
            //console.log("Longitud: ", longitud); // --> Latitud: undefined

            const {insertedId} = await contexto.colectionRestaurantes.insertOne({
                nombre, direccion, ciudad, telefono, pais, latitud, longitud
            });

            return {
                _id: insertedId,
                nombre, direccion, ciudad, telefono, pais, latitud, longitud
            }

        },
        deleteRestaurant: async (_: unknown, params: DeleteRestaurantParams, contexto: Contexto): Promise<boolean> => {
            const {deletedCount} = await contexto.colectionRestaurantes.deleteOne({_id: new ObjectId(params.id)});
            return deletedCount === 1;
        }
    },
    Restaurante: {
        id: (parent: RestauranteModel): string => parent._id!.toString(),
        //Unifico la direccion del restaurante en una sola, usando la direcion (calle y numero), la ciudad, y el pais
        direccion_restaurante: (parent: RestauranteModel): string => {
            const direccion = `${parent.direccion}, ${parent.ciudad}, ${parent.pais}`
            return direccion;
        },
        temperatura_actual: async (parent: RestauranteModel): Promise<number> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("ERROR: No se ha proporcionado la API KEY de API Ninja");

            const url_weather = `https://api.api-ninjas.com/v1/weather?lat=${parent.latitud}&lon=${parent.longitud}`;
            const data_weather = await fetch(url_weather, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });
            if(data_weather.status !== 200) throw new GraphQLError("ERROR: No se ha conectado correctamente a la API Weather");
            const response_weather: APIWeather = await data_weather.json();
            const temp = response_weather.temp;
            return temp;
        },
        hora_local: async (parent: RestauranteModel): Promise<string> => {
            const API_KEY = Deno.env.get("API_KEY");
            if(!API_KEY) throw new GraphQLError("ERROR: No se ha proporcionado la API KEY de API Ninja");

            const url_worldtime = `https://api.api-ninjas.com/v1/worldtime?lat=${parent.latitud}&lon=${parent.longitud}`;
            const data_worldtime = await fetch(url_worldtime, {
                headers: {
                    'X-Api-Key': API_KEY
                }
            });
            if(data_worldtime.status !== 200) throw new GraphQLError("ERROR: No se ha conectado correctamente a la API World Time");
            const response_worldtime: APIWorldTime = await data_worldtime.json();
            const hour = response_worldtime.hour;
            const minute = response_worldtime.minute;
            const hora = `${hour}:${minute}`
            return hora;
        },
    }
}
