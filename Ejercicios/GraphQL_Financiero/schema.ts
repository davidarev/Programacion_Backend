//ESQUEMA GRAPHQL
export const schema = `#graphql
  type Usuario {
    id: ID!
    name: String!
    iban: String!
    zip_code: String!
    banco_id: ID!
  }

  type Banco {
    id: ID!
    name: String!
    usuarios: [ID!]!
  }

  type Query {
    GetBancos: [Banco!]!
    GetUsuarios: [Usuario!]!
    GetBanco(id: ID!): Banco
  }

  type Mutation {
    AddUsuario(name: String!, iban: String!, zip_code: String!): Usuario!
    AddBanco(name: String!): Banco!
  }
`