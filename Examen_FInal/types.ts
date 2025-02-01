import {OptionalId} from "mongodb"

// Objeto a almacenar en MongoDB
export type RestauranteModel = OptionalId<{
    nombre: string,
    direccion: string,
    ciudad: string,
    latitud: number,
    longitud: number,
    pais: string,
    telefono: string,
}>

//APIs NINJA
// https://api.api-ninjas.com/v1/validatephone
export type APIPhone = {
    country: string
    is_valid: boolean
}

// https://api.api-ninjas.com/v1/city
export type APICity = {
    latitude: number,
    longitude: number,
}

// https://api.api-ninjas.com/v1/weather
export type APIWeather = {
    temp: number
}

// https://api.api-ninjas.com/v1/worldtime
export type APIWorldTime = {
    hour: string,
    minute: string,
}
