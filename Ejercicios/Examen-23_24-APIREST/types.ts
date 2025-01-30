import {OptionalId} from "mongodb"

export type ContactoModel = OptionalId<{
    name: string,
    last_name: string,
    phone: string,
    country: string,
    timezone: string,
}>

export type Contacto = {
    id: string,
    name: string,
    last_name: string,
    phone: string,
    country: string,
    timezone: string,
    datetime: string,
}

export type APIWorldTime = {
    datetime: string
}

export type APIPhone = {
    timezones: string,
    is_valid: boolean,
    country: string,
}