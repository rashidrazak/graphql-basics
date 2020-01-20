'use strict'

const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) return db.users

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
}

export default Query