import { UsuarioModel, BancoModel, Usuario, Banco } from './types.ts';
import { Collection } from 'mongodb';
import {collectionBancos} from "./main.ts"

export const fromModelToUsuario = async (usuario: UsuarioModel, collectionBancos: Collection<BancoModel>): Promise<Usuario> => {
    const bancos = await collectionBancos.find({_id: {$in: usuario.bank}}).toArray();
    return {
        id: usuario._id!.toString(),
        name: usuario.name,
        iban: usuario.iban,
        account_number: usuario.account_number,
        bank: bancos.map((b) => ({
            id: b._id!.toString(),
            name: b.name,
            usuarios: b.usuarios
        }))
    }
}

export const fromModelToBanco = async (banco: BancoModel, collectionUsuarios: Collection<UsuarioModel>): Promise<Banco> => {
    const usuarios = await collectionUsuarios.find({_id: {$in: banco.usuarios}}).toArray();
    return {
        id: banco._id!.toString(),
        name: banco.name,
        usuarios: await Promise.all(usuarios.map((u: UsuarioModel) => fromModelToUsuario(u, collectionBancos)))
    }
}