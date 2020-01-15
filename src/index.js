import { GraphQLServer } from 'graphql-yoga'

/**
 * Type Definitions (Schema)
 */
const typeDefs = `
  type Query {
    greeting(name: String) : String!
    add(numbers: [Float!]!): Float!
    grades: [Int!]!
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
    greeting(parent, args, ctx, info) {
      console.log(args)

      if (args.name) {
        return `Hello, ${args.name}!`
      }

      return 'Hello!'
    },
    add(parent, args, ctx, info) {
      if (args.numbers.length === 0) return 0
      return args.numbers.reduce((accumulator, currentValue) => {
        return accumulator + currentValue
      })
    },
    grades(parent, args, ctx, info) {
      return [96, 95, 98]
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