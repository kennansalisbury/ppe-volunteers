const MONGOOSE = require('mongoose')
const DB = require('..')

let clinics = [{
    name: 'Richmond Pediatrics',
    address: '367 NW Richmond Beach Rd',
    city: 'Shoreline',
    zipcode: '98177-3101'
}, {
    name: 'Skagit Pediatrics',
    address: '2101 Little Mountain Lane',
    city: 'Mount Vernon',
    zipcode: '98274-8752'
}, {
    name: 'Neighbor Care Health - Columbia City',
    address: '4400 37th Ave S.',
    city: 'Seattle',
    zipcode: '98118-1609'
}, {
    name: 'Mount St. Vincent',
    address: '4831 35th Ave SW',
    city: 'Seattle',
    zipcode: '98126-2709'

}, {
    name: 'University Place Pediatric Clinic',
    address: '1033 Regents Blvd # 102',
    city: 'Fircrest',
    zipcode: '98466-6089'
}, {
    name: 'Mercer Island Pediatrics',
    address: '9675 SE 36th Ste 100',
    city: 'Mercer Island',
    zipcode: '98040-3723'
}]
let regionNames = ['north', 'south', 'east', 'west']


DB.User.find({isClinic: true})
.then(users => {
    let userIds = users.map(user => user._id)

    let data = clinics.map((clinic, index) => ({
        name: clinic.name,
        address: clinic.address,
        city: clinic.city,
        state: 'WA',
        zipcode: clinic.zipcode,
        region: regionNames[(Math.floor(Math.random() * regionNames.length))],
        numberOfEmployees: Math.floor(Math.random() * 100),
        assignedUser: userIds[Math.floor(Math.random() * userIds.length)],
        orders: null
    }))

DB.Clinic.create(data).then(console.log('clinics seeded'))

})