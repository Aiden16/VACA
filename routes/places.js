const express = require('express')
const controlPlaces = require('../controllers/controlPlaces')
// const flash=require('connect-flash')
const router = express.Router()
const catchAsync = require('../utilis/catchAsync')
const ExpressError = require('../utilis/ExpressError')
const Place = require('../Models/vaca')
const { placeSchema,reviewSchema } = require('../schema.js');
const {isLoggedIn,isAuthor,validatePlaces} = require('../middleware')


//home route
router.get('/' ,catchAsync(controlPlaces.index))

//new
router.get('/new',isLoggedIn,async(req,res)=>{
    res.render('Places/new')
})
//new post
router.post('/',isLoggedIn, validatePlaces ,catchAsync(controlPlaces.createPlace))

//details route

router.get('/:id',catchAsync(controlPlaces.viewPlace))

//edit route
router.get('/:id/edit', isAuthor ,isLoggedIn, catchAsync(controlPlaces.editForm))

//put of edit
router.put('/:id',isLoggedIn, isAuthor ,validatePlaces ,catchAsync(controlPlaces.putEdit))

//delete 
router.delete('/:id',isLoggedIn,catchAsync(controlPlaces.deletePlace))


module.exports = router