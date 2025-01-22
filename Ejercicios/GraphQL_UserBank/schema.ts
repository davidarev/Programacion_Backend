export const schema = `#graphql
    type Usuario {
        id: ID!,
        name: String!,
        iban: String!,
        bank: String!,
        country_bank: String!,
        zip_code: String!,
        city: String!,
        country: String!,
    },
    type Query {
        getUsuario(iban: String!): Usuario,
        getUsuarios: [Usuario!]!,
    },
    type Mutation {
        addUsuario(name: String!, iban: String!, zip_code: String!): Usuario!,
        deleteUsuario(id: ID!): Boolean!,
    }
`