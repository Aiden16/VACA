const Review = require('../Models/review')
const Place = require('../Models/vaca')

module.exports.createReview = async(req,res)=>{
    const place = await Place.findById(req.params.id)
    const review = new Review(req.body.review)
    review.author = req.user.id 
    place.reviews.push(review)
    await place.save()
    await review.save()
    req.flash('success','Review was created')
    res.redirect(`/places/${place.id}`)
}

module.exports.deleteReview=async(req,res)=>{
    const {id,reviewId} = req.params
    await Review.findByIdAndDelete(reviewId)
    await Place.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
    req.flash('success','Review was deleted')
    res.redirect(`/places/${id}`)
}