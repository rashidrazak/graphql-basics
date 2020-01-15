import { GraphQLServer } from 'graphql-yoga'

// Demo user data
const users = [
  {
    id: '1',
    name: 'Rashid Razak',
    email: 'rashid@gmail.com',
    age: 29
  },
  {
    id: '2',
    name: 'Shairah Rahman',
    email: 'shairah@gmail.com',
    age: 29
  },
  {
    id: '3',
    name: 'Hamzah',
    email: 'hamzah@gmail.com',
    age: 4
  },
  {
    id: '1',
    name: 'Umar',
    email: 'umar@gmail.com',
    age: 1
  },
]

/**
 * Type Definitions (Schema)
 */
const typeDefs = `
  type Query {
    users: [User!]!
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
      return users
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