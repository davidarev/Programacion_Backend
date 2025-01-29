import {OptionalId, ObjectId} from "mongodb"

export type UsuarioModel = OptionalId<{
    name: string,
    iban: string,
    bank: ObjectId[],
    account_number: string
}>

export type Usuario = {
    id: string,
    name: string,
    iban: string,
    bank: Banco[],
    account_number: string
}

export type BancoModel = OptionalId<{
    name: string,
    usuarios: ObjectId[],
}>

export type Banco = {
    id: string,
    name: string,
    usuarios: Usuario[],
}

export type APIIBAN = {
    account_number: string,
    bank_name: string
}