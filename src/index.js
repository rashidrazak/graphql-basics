import { GraphQLServer } from 'graphql-yoga'
import uuidv4 from 'uuid/v4'

import users from './users'
import posts, { setPosts } from './posts'
import comments, { setComments } from './comments'


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
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id)
      if (userIndex === -1) throw new Error(`User not found`)

      const deletedUser = users.splice(userIndex, 1)
      let newPosts, newComments

      newPosts = posts.filter((post) => {
        const match = post.author === args.id
        if (match) {
          newComments = comments.filter(comment => comment.post !== post.id)
          setComments(newComments)
        }
        return !match
      })

      setPosts(newPosts)

      newComments = comments.filter(comment => comment.author !== args.id)
      setComments(newComments)
      return deletedUser[0]
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)
      if (!userExists) throw new Error(`User not found`)

      const newPost = { id: uuidv4(), ...args.data }

      posts.push(newPost)
      return newPost
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id)
      if (postIndex === -1) throw new Error(`Post not found`)

      const deletedPost = posts.splice(postIndex, 1)
      let newComments = comments.filter((comment) => comment.post !== args.id)
      setComments(newComments)

      return deletedPost[0]
    },
    createComment(parent, args, ctx, info) {
      const userExists = users.some(user => user.id === args.data.author)
      if(!userExists) throw new Error(`User not found`)
      const postExists = posts.some(post => post.id === args.data.post && post.published)
      if (!postExists) throw new Error(`Post not found`)

      const newComment = { id: uuidv4(), ...args.data }

      comments.push(newComment)
      return newComment
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(comment => comment.id === args.id)
      if (commentIndex === -1) throw new Error(`Comment not found`)

      const deletedComment = comments.splice(commentIndex, 1)
      return deletedComment[0]
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
  typeDefs: './src/schema.graphql',
  resolvers: resolvers
})

server.start(() => {
  console.log(`The server is up!`)
})