export const schema = `#graphql
    type Contacto {
        id: ID!,
        name: String!,
        phone: String!,
        country: String!,
        timezone: String!,
        created: String!,
        datetime: String!,
    },
    type Query {
        getContacto(id: ID!): Contacto,
        getContactos: [Contacto!]!
    },
    type Mutation {
        addContacto(name: String!, phone: String!): Contacto!,
        deleteContacto(id: ID!): Boolean!
    }
`