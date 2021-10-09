const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url:String,
    filename:String
})
//mongoose vritual
ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200')
})

const opts = { toJSON: {virtuals:true}}

const vacaSchema = new Schema({
    title:String,
    images:[ImageSchema],
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:'Review'
    }]
},opts)

vacaSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
    console.log('Deleteddd')
})

vacaSchema.virtual('properties.popUpMarkup').get(function(){
    return `<strong><a href="/places/${this.id}">${this.title}</a></strong>
    <P>${this.description.substring(0,20)}....</p>`
})

module.exports = mongoose.model("Place",vacaSchema)

// /places/615e9fbbcbd53a290c4d0d6b