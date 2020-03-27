const MONGOOSE = require('mongoose')
const DB = require('..')


DB.User.find({isProducer: true})
.then(producers => {
    let producerIds = producers.map(producer => producer._id)
    
    DB.Clinic.find()
    .then(clinics => {

        DB.Product.find({name: 'Mask'})
        .then(product => {

            let data = clinics.map(clinic => ({
                producer: producerIds[Math.floor(Math.random() * producerIds.length)],
                clinic: clinic._id,
                collected: false,
                delivered: false,
                products: [{
                    product: product[0]._id, 
                    quantity: Math.ceil(Math.random() * 100)
                }]
            })
            )
            
            // DB.ProductOrder.create(data).then(console.log('orders seeded'))
            console.log(data.forEach(d => console.log(d.products)))

        })

    })
})