'use strict'

import uuidv4  from 'uuid/v4'

const Mutation = {
  createUser(parent, args, { db }, info) {
    if (!args.data.name && !args.data.email) throw new Error(`Required parameters not provided`)
    const isEmailAvailable = !db.users.some(user => user.email === args.data.email)
    if (!isEmailAvailable) throw new Error(`This email is taken`)

    const newUser = { id: uuidv4(), ...args.data }

    db.users.push(newUser)
    console.log(db.users)
    return newUser
  },
  updateUser(parent, args, { db }, info) {
    const { id, data } = args
    const  user = db.users.find(user => user.id === id)

    if (!user) throw new Error(`User not found`)

    if (typeof data.email === 'string') {
      const isEmailAvailable = !db.users.some(user => user.email === data.email)
      if (!isEmailAvailable) throw new Error(`Email taken`)
      user.email = data.email
    }

    if (typeof data.name === 'string') user.name = data.name
    if (typeof data.age !== 'undefined') user.age = data.age

    return user
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
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author)
    if (!userExists) throw new Error(`User not found`)

    const newPost = { id: uuidv4(), ...args.data }

    db.posts.push(newPost)
    if (newPost.published) pubsub.publish(`post`, {
      post: {
        mutation: 'CREATED',
        data: newPost
      }
    })
    return newPost
  },
  updatePost(parent, args, { db, pubsub }, info) {
    const { id, data } = args
    const post = db.posts.find(post => post.id === id)
    if (!post) throw new Error(`Post not found`)

    const originalPost = { ...post }

    if (typeof data.title === 'string') post.title = data.title
    if (typeof data.body === 'string') post.body = data.body

    if (typeof data.published === 'boolean') {
      post.published = data.published

      if (originalPost.published && !post.published) {
        pubsub.publish(`post`, {
          post: {
            mutation: 'DELETED',
            data: originalPost
          }
        })
      } else if (!originalPost.published && post.published) {
        pubsub.publish(`post`, {
          post: {
            mutation: 'CREATED',
            data: post
          }
        })
      }
    } else if (post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: 'UPDATED',
          data: post
        }
      })
    }

    return post
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id)
    if (postIndex === -1) throw new Error(`Post not found`)

    const deletedPost = db.posts.splice(postIndex, 1)
    db.comments = db.comments.filter((comment) => comment.post !== args.id)

    if (deletedPost[0].published) pubsub.publish(`post`, {
      post: {
        mutation: 'DELETED',
        data: deletedPost[0]
      }
    })

    return deletedPost[0]
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author)
    if (!userExists) throw new Error(`User not found`)
    const postExists = db.posts.some(post => post.id === args.data.post && post.published)
    if (!postExists) throw new Error(`Post not found`)

    const newComment = { id: uuidv4(), ...args.data }

    db.comments.push(newComment)
    pubsub.publish(`comment ${args.data.post}`, { comment: newComment })

    return newComment
  },
  updateComment(parent, args, { db }, info) {
    const { id, data } = args
    const comment = db.comments.find(comment => comment.id === id)
    if (!comment) throw new Error(`Comment not found`)

    if (typeof data.text === 'string') comment.text = data.text

    return comment
  },
  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(comment => comment.id === args.id)
    if (commentIndex === -1) throw new Error(`Comment not found`)

    const deletedComment = db.comments.splice(commentIndex, 1)
    return deletedComment[0]
  }
}

export default Mutation