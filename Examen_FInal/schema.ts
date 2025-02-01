export const schema = `#graphql
    type Restaurante {
        id: ID!,
        nombre: String!,
        direccion_restaurante: String!, #Campo que muestra la direccion del restaurante unificada
        telefono: String!,
        temperatura_actual: String!,
        hora_local: String!
    },
    type Query {
        getRestaurants(ciudad: String!): [Restaurante!]!,
        getRestaurant(id: ID!): Restaurante,
    },
    type Mutation {
        addRestaurant(nombre: String!, direccion: String!, ciudad: String!, telefono: String!): Restaurante!,
        deleteRestaurant(id: ID!): Boolean!
    }
`
