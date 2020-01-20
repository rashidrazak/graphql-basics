import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

import db from './db'

/**
 * Resolvers
 */
const resolvers = {
  Query: {
    users(parent, args, { db }, info) {
      if (!args.query) return db.users

      // Filter user's name. Return user if name contains letter specified in query (case insensitive)
      return db.users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, { db }, info) {
      if (!args.query) return db.posts

      return db.posts.filter((post) => {
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
    comment(parent, args, { db }, info) {
      return db.comments
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      if (!args.data.name && !args.data.email) throw new Error(`Required parameters not provided`)
      const isEmailAvailable = !db.users.some(user => user.email === args.data.email)
      if (!isEmailAvailable) throw new Error(`This email is taken`)

      const newUser = { id: uuidv4(), ...args.data }

      db.users.push(newUser)
      console.log(db.users)
      return newUser
    },
    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex((user) => user.id === args.id)
      if (userIndex === -1) throw new Error(`User not found`)

      const deletedUser = db.users.splice(userIndex, 1)

      db.posts = db.posts.filter((post) => {
        const match = post.author === args.id
        if (match) {
          db.comments = db.comments.filter(comment => comment.post !== post.id)
        }
        return !match
      })

      db.comments = db.comments.filter(comment => comment.author !== args.id)
      return deletedUser[0]
    },
    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author)
      if (!userExists) throw new Error(`User not found`)

      const newPost = { id: uuidv4(), ...args.data }

      posts.push(newPost)
      return newPost
    },
    deletePost(parent, args, { db }, info) {
      const postIndex = db.posts.findIndex((post) => post.id === args.id)
      if (postIndex === -1) throw new Error(`Post not found`)

      const deletedPost = db.posts.splice(postIndex, 1)
      db.comments = db.comments.filter((comment) => comment.post !== args.id)

      return deletedPost[0]
    },
    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.data.author)
      if(!userExists) throw new Error(`User not found`)
      const postExists = db.posts.some(post => post.id === args.data.post && post.published)
      if (!postExists) throw new Error(`Post not found`)

      const newComment = { id: uuidv4(), ...args.data }

      comments.push(newComment)
      return newComment
    },
    deleteComment(parent, args, { db }, info) {
      const commentIndex = db.comments.findIndex(comment => comment.id === args.id)
      if (commentIndex === -1) throw new Error(`Comment not found`)

      const deletedComment = db.comments.splice(commentIndex, 1)
      return deletedComment[0]
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return user.id === parent.author
      })
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter((post) => {
        return post.author === parent.id
      })
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter((comment) => {
        return comment.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, { db }, info) {
      return db.users.find((user) => {
        return user.id === parent.author
      })
    },
    post(parent, args, { db }, info) {
      return db.posts.find((post) => {
        return post.id === parent.post
      })
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: resolvers,
  context: {
    db
  }
})

server.start(() => {
  console.log(`The server is up!`)
})