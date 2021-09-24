const express = require('express')
const controlPlaces = require('../controllers/controlPlaces')
const router = express.Router()
const catchAsync = require('../utilis/catchAsync')
const ExpressError = require('../utilis/ExpressError')
const Place = require('../Models/vaca')
const { placeSchema,reviewSchema } = require('../schema.js');
const {isLoggedIn,isAuthor,validatePlaces} = require('../middleware')

//cloudinary 
const multer  = require('multer')
const {storage} = require('../cloudinary/index')

//to upload files to cloud
const upload = multer({ storage })
//multer to upload files locally
// const upload = multer({ dest: 'uploads/' })


//home route
router.get('/' ,catchAsync(controlPlaces.index))

//new
router.get('/new',isLoggedIn,async(req,res)=>{
    res.render('Places/new')
})
//new post
router.post('/',isLoggedIn,upload.array('image'),validatePlaces,catchAsync(controlPlaces.createPlace))
// router.post('/',upload.array('image'),(req,res)=>{
//     console.log(req.body,req.files)
// })

//details route

router.get('/:id',catchAsync(controlPlaces.viewPlace))

//edit route
router.get('/:id/edit', isAuthor ,isLoggedIn, catchAsync(controlPlaces.editForm))

//put of edit
router.put('/:id',isLoggedIn, isAuthor ,upload.array('image'),validatePlaces ,catchAsync(controlPlaces.putEdit))

//delete 
router.delete('/:id',isLoggedIn,catchAsync(controlPlaces.deletePlace))


module.exports = router