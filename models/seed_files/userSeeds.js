const MONGOOSE = require('mongoose')
const DB = require('../../models')

let firstNames = ['Allie', 'Bob', 'Cathy', 'Devon', 'Edgar', 'Frank', 'Gilda', 'Harriet', 'Ivar']
// let usernames = []
// firstNames.forEach(name => {
//     usernames.push(`${name.toLowerCase()}123`)
// })
// let passwords = []
// firstNames.forEach((name, index) => {
//     passwords.push('password' + index)
// })
// let emails = []
// firstNames.forEach(name => {
//     emails.push(`${name}123@gmail.com`)
// })
// let addresses = []
// lastNames.forEach(name => {
//     addresses.push(`123 ${name} St.`)
// })
// let city = 'Seattle'
// let state = 'WA'
// let zips = []
// firstNames.forEach(name => {
//     zips.push(`${Math.floor(Math.random() * 100000)}-${Math.floor(Math.random() * 10000)}`)
// })
let regionNames = ['north', 'south', 'east', 'west']
// let regions = []
// firstNames.forEach(name => {
//     regions.push(regionNames[(Math.floor(Math.random() * regionNames.length))])
// })

let booleans = [true, false]



let data = firstNames.map((name, index) => ({
    index,
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
    orders: null
}))

DB.User.create(data)