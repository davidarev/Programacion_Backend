import { OptionalId } from 'mongodb';
export type ContactoModel = OptionalId<{
    name: string,
    phone: string,
    country: string,
    timezone: string,
    created: string,
}>

export type APIPhone = {
    is_valid: string,
    country: string,
    timezones: string[],
}

export type APIWorldTime = {
    datetime: string,
}