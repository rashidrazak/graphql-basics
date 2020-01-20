'use strict'

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
    id: '4',
    name: 'Umar',
    email: 'umar@gmail.com',
    age: 1
  },
]

const posts = [
  {
    id: '10',
    title: 'GraphQL 101',
    body: 'This is an introduction to GraphQL...',
    published: true,
    author: '1'
  },
  {
    id: '11',
    title: 'Introduction to Svelte',
    body: 'Svelte sounds sucks but...',
    published: true,
    author: '2'
  },
  {
    id: '12',
    title: 'Flutter is Killing React Native',
    body: 'Yeah! You heard that right. React Native is dying...',
    published: true,
    author: '3'
  },
  {
    id: '13',
    title: 'Audio Programming Fundamentals',
    body: 'I hate audio programming. The waveform...',
    published: false,
    author: '1'
  },
]

const comments = [
  {
    id: '1',
    text: 'Comment 01',
    author: '1',
    post: '10'
  },
  {
    id: '2',
    text: 'Comment 02',
    author: '1',
    post: '11'
  },
  {
    id: '3',
    text: 'Comment 03',
    author: '3',
    post: '10'
  },
  {
    id: '4',
    text: 'Comment 04',
    author: '4',
    post: '13'
  }
]

const db = {
  users,
  posts,
  comments
}

export default db