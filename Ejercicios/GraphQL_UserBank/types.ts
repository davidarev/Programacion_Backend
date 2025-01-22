import {OptionalId} from "mongodb"

export type UsuarioModel = OptionalId<{
    name: string,
    iban: string,
    bank: string,
    country_bank: string,
    zip_code: string,
    city: string,
    country: string,
}>

export type APIZipCode = {
    valid: boolean,
    city: string,
    country: string,
}

export type APIIban = {
    valid: boolean,
    bank_name: string,
    country: string,
}