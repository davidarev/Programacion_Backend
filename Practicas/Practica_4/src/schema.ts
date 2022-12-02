import { gql } from "graphql_tag";

export const typeDefs = gql`
  type Coche{
    id:String!
    matricula:String!
    color:String!
    puertas:Int!
    modelo:String!
    marca:String!
    precio:Int!
  }
  type Vendedor{
    id:String!
    nombre:String!
    apellido:String!
    telefono:String!
    correo:String!
    coches:[Coche!]
  }
  type Concesionario{
    id:String!
    nombre:String!
    pais:String!
    telefono:String!
    nombre_dueno:String!
    vendores:[Vendedor!]
  }
  type Query {
    getCar(id: ID!): Coche
    getVendedor(id:ID!):Vendedor
    getConcesionario(id:ID!):Concesionario
  }
  type Mutation{
    CrearCoche(matricula:String!,color:String!,puertas:Int!,modelo:String!,marca:String!,precio:Int!):Coche!
    CrearVendedor(nombre:String!,apellido:String!,telefono:String!,correo:String!):Vendedor!
    CrearConcesionario(nombre:String!,pais:String!,telefono:String,nombre_dueno:String!):Concesionario!
    anadirCocheVendedor(id_coche:String!,id_vendedor:String!):Vendedor
  }
`;
