import { GraphQLServer } from 'graphql-yoga'

/**
 * Type Definitions (Schema)
 */
const typeDefs = `
  type Query {
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
    me() {
      return {
        id: '123098',
        name: 'Rashid Razak',
        email: 'rashid@gmail.com',
        age: 29
      }
    },
    post() {
      return {
        id: '092',
        title: 'GraphQL 101',
        body: '',
        published: false
      }
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