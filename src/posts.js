'use strict'

// Demo posts data
let posts = [
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

function setPosts(newPosts) {
  posts = newPosts
}

export { posts as default, setPosts }