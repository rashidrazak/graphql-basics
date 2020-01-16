import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

import users from './users'
import posts from './posts'
import comments from './comments'

/**
 * Type Definitions (Schema)
 */
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    me: User!
    post: Post!
    comment: [Comment!]!
  }

  type Mutation {
    createUser(data: CreateUserInput): User!
    createPost(data: CreatePostInput): Post!
    createComment(data: CreateCommentInput): Comment!
  }

  input CreateUserInput {
    name: String!
    email: String!
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
    author: ID!
  }

  input CreateCommentInput {
    text: String!
    author: ID!
    published: Boolean!
    post: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    posts(parent, args, ctx, info) {
      if (!args.query) return posts

      return posts.filter((post) => {
        const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
        const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
        return isTitleMatch || isBodyMatch
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
    },
    comment(parent, args, ctx, info) {
      return comments
    }
  },
  Mutation: {
    createUser(parent, args, ctx, info) {
      if (!args.data.name && !args.data.email) throw new Error(`Required parameters not provided`)
      const isEmailAvailable = !users.some(user => user.email === args.data.email)
      if (!isEmailAvailable) throw new Error(`This email is taken`)

      const newUser = { id: uuidv4(), ...args.data }

      users.push(newUser)
      console.log(users)
      return newUser
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)
      if (!userExists) throw new Error(`User not found`)

      const newPost = { id: uuidv4(), ...args.data }

      posts.push(newPost)
      return newPost
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)
      if(!userExists) throw new Error(`User not found`)
      const postExists = posts.some(post => post.id === args.data.post && post.published)
      if (!postExists) throw new Error(`Post not found`)

      const newComment = { id: uuidv4(), ...args.data }

      comments.push(newComment)
      return newComment
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => {
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post
      })
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