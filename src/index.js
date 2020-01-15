import { GraphQLServer } from 'graphql-yoga'

/**
 * Type Definitions (Schema)
 */
const typeDefs = `
  type Query {
    id: ID!
    name: String!
    age: Int!
    employed: Boolean!
    gpa: Float!
  }
`


/**
 * Resolvers
 */
const resolvers = {
  Query: {
    id() {
      return 'abc123'
    },
    name() {
      return 'Rashid Razak'
    },
    age() {
      return 29
    },
    employed() {
      return true
    },
    gpa() {
      return 3.95
    }
  }
}

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers
})

server.start(() => {
  console.log(`The server is up!`)
})