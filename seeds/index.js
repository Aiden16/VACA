const mongoose = require('mongoose')
const Place = require('../Models/vaca')
const cities = require('./cities')
const {descriptors,places} = require('./seedHelper')

mongoose.connect('mongodb://localhost:27017/Vaca', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true
    })
const db = mongoose.connection
db.on('error',console.error.bind(console,'connection error'))
db.once('open',()=>{
    console.log('Database connected')
})

const randomTitle = (array)=>{
    return array[Math.floor(Math.random()*array.length)]
}
const seed = async()=>{
    await Place.deleteMany({});
    for(let i=0;i<=50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*30)+10
        const newPlace = new Place({
            author:'612218b28cc5f8088c0f6689',
            title:`${randomTitle(descriptors)} ${randomTitle(places)}`,
            location:`${cities[random1000].city},${cities[random1000].state}`,
            images: [ 
                 {
                url: 'https://res.cloudinary.com/dvdnsiqrt/image/upload/v1632419228/VACA/gdlmoss0wkqyavlwh7ig.jpg',
                filename: 'VACA/gdlmoss0wkqyavlwh7ig'
              }
            ],
            description:'Peter Piper picked a peck of pickled peppers A peck of pickled peppers Peter Piper picked If Peter Piper picked a peck of pickled peppers Where the peck of pickled peppers Peter Piper picked?',
            price
        })

        await newPlace.save()
    }


}

seed().then(()=>{
    mongoose.connection.close()
})