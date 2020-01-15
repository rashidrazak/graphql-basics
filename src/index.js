import { GraphQLServer } from 'graphql-yoga'

import users from './users'
import posts from './posts'

/**
 * Type Definitions (Schema)
 */
const typeDefs = `
  type Query {
    users(query: String): [User!]!
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
    users(parent, args, ctx, info) {
      if (!args.query) return users

      // Filter user's name. Return user if name contains letter specified in query (case insensitive)
      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
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