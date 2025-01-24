import { ObjectId, OptionalId } from "mongodb";

//TIPOS DE DATOS QUE SE ALMACENAN EN MONGODB
//Tipo de dato Usuario
export type UsuarioModel = OptionalId<{
  name: string,
  iban: string,
  zip_code: string,
  banco_id: ObjectId,
}>

//Tipo de dato Banco
export type BancoModel = OptionalId<{
  name: string,
  usuarios: ObjectId[],
}>

//TIPOS DE DATOS DESDE LA API NINJA
// https://api-ninjas.com/api/iban
export type APIIBAN = {
    bank_name: string    
}
