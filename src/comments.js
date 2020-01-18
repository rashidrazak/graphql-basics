'use strict'

let comments = [
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

function setComments(newComments) {
  comments = newComments
}

export { comments as default, setComments }