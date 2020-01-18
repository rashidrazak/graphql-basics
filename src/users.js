'use strict'

// Demo user data
let users = [
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

function setUsers(newUsers) {
  users = newUsers
}

export { users as default, setUsers}