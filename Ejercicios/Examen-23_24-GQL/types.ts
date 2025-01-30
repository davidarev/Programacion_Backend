import {OptionalId} from "mongodb"

export type ContactoModel = OptionalId<{
    name: string,
    last_name: string,
    phone: string,
    country: string,
    timezone: string,
}>

export type APIPhone = {
    is_valid: boolean,
    country: string,
    timezones: string
}

export type APIWorldTime = {
    datetime: string
}