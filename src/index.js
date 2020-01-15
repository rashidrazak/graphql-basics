import { GraphQLServer } from 'graphql-yoga'

/**
 * Type Definitions (Schema)
 */
const typeDefs = `
  type Query {
    greeting: String!
    me: User!
    post: Post!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
  }
`


/**
 * Resolvers
 */
const resolvers = {
  Query: {
    
  }
}

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers
})

server.start(() => {
  console.log(`The server is up!`)
})