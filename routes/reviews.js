const express = require('express')
const router = express.Router({mergeParams:true})
const catchAsync = require('../utilis/catchAsync')
const ExpressError = require('../utilis/ExpressError')
const controlReview = require('../controllers/controlReview')
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware')
const { placeSchema,reviewSchema } = require('../schema.js');

//to post reviews
//place/placeId/review
router.post('/', validateReview, isLoggedIn , catchAsync(controlReview.createReview))

//to delete reviews
// /places/6103d05f275ac428bc316681/review/6114b83abe275734ac210939?_method=DELETE

router.delete('/:reviewId',isLoggedIn, isReviewAuthor ,catchAsync(controlReview.deleteReview))

module.exports = router