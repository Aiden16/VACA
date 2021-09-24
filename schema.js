  
const Joi = require('joi');

module.exports.placeSchema = Joi.object({
    places: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0).max(5),
        // image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages:Joi.array()
});

module.exports.reviewSchema  = Joi.object({
    review:Joi.object({
        body:Joi.string().required(),
        rating:Joi.number().required().min(0)
    }).required()
})

