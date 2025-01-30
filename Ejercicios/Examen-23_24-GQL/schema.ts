export const schema = `#graphql
    type Contacto {
        id: ID!,
        name: String!,
        last_name: String!,
        phone: String!,
        country: String!,
        date: String!
    },
    type Query {
        getContacts: [Contacto!]!
        getContact(id: ID!): Contacto
    },
    type Mutation {
        addContact(name: String!, last_name: String!, phone: String!): Contacto!
        deleteContact(id: ID!): Boolean!
    }
`