const MONGOOSE = require('mongoose')
const DB = require('../../models')

let firstNames = ['Allie', 'Bob', 'Cathy', 'Devon', 'Edgar', 'Frank', 'Gilda', 'Harriet', 'Ivar']
let regionNames = ['north', 'south', 'east', 'west']


let data = firstNames.map((name, index) => ({
    firstName: name,
    lastName: `${name}ington`,
    username: `${name.toLowerCase()}123`,
    password: `password${name.toLowerCase()}123`,
    email: `${name}123@gmail.com`,
    address: `123 ${name} St.`,
    city: 'Seattle',
    state: 'WA',
    zipcode: `${Math.floor(Math.random() * 100000)}-${Math.floor(Math.random() * 10000)}`,
    region: regionNames[(Math.floor(Math.random() * regionNames.length))],
    isProducer: (index === 0 | index === 1 | index === 2 ) ? true : false ,
    isProdLead: (index === 3 | index === 4) ? true : false ,
    isClinic: (index === 5 | index === 6) ? true : false ,
    isAdmin: index === 7 ? true : false,
    isDriver: index === 8 ? true : false,
    inventory: (index === 0 | index === 1 | index === 2 ) ? Math.floor(Math.random() * 41) : null,
    orders: null,
    isActive: true
}))

DB.User.create(data).then(console.log('users seeded'))