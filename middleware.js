const Place = require('./Models/vaca')
const Review = require('./Models/review')
const { placeSchema,reviewSchema } = require('./schema.js')
const ExpressError = require('./utilis/ExpressError')

//--middleware to check if user is logged in----//
module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        //store url to which user was trying to visit
        req.session.returnTo = req.originalUrl
        req.flash('error','you must be signed in!')
        return res.redirect('/login')
    }
    next()
}


//--middleware to check if user own the palace--//
module.exports.isAuthor = async(req,res,next)=>{
    const foundPlace = await Place.findById(req.params.id)
    if(!foundPlace.author.equals(req.user.id)){
        req.flash('error','You do not have permission!!')
        return res.redirect(`/places/${foundPlace.id}`)
    }
    next()
}

//--middleware to check if user own the review--//
module.exports.isReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params
    const foundReview = await Review.findById(reviewId)
    if(!foundReview.author.equals(req.user.id)){
        req.flash('error','You do not have permission!!')
        return res.redirect(`/places/${id}`)
    }
    next()
}


//custom middleware to validate places
module.exports.validatePlaces = (req, res, next) => {
    console.log(req.body)
    const { error } = placeSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//custom middleware to validate reviews
module.exports.validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}