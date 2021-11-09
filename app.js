if (process.env.NODE_ENV!=="production"){
    require('dotenv').config()
}
console.log(process.env.CLOUDINARY_CLOUD_NAME)
const express = require('express')
const session = require('express-session')
const flash = require('connect-flash');
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const path = require('path')
const catchAsync = require('./utilis/catchAsync')
const ExpressError = require('./utilis/ExpressError')
const Place = require('./Models/vaca')
const Review = require('./Models/review')
const Joi = require('joi')
const { placeSchema,reviewSchema } = require('./schema.js');
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./Models/user')
const MongoStore = require('connect-mongo');
// const {reviewSchema} = require('./schema')
// const dbUrl = process.env.DB_URL

const dbUrl = process.env.DB_URL||'mongodb://localhost:27017/Vaca'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify:false
    })
const db = mongoose.connection
db.on('error',console.error.bind(console,'connection error'))
db.once('open',()=>{
    console.log('Database connected')
})



const app = express()
app.use(express.static("Public"));

//--routes-----//
const placesRoutes = require('./routes/places')
const reviewsRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')
//--session-----//

//to store session details in mongo rather than in memory
const secret = process.env.SECRET || 'Thisisasecret'

const store = new MongoStore({
    mongoUrl: dbUrl,
    secret,
    touchAfter:24*3600
})

store.on('error',function(e){
    console.log("Store error!",e)
})
const sessionConfig = {
    store:store,    
    secret,
    resave:false,
    saveUninitialized:true,
    cookies:{
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:1000*60*60*24*7
    }

}
app.use(session(sessionConfig)) //should be used before the passport session
//--flash----//
app.use(flash());
//passport//
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    // console.log(req.session)
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//------Middlewares----------//
app.set('views',path.join(__dirname,'views'))
app.set('view engine','ejs')
app.engine('ejs',ejsMate)
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use('/',userRoutes)
app.use('/places',placesRoutes)
app.use('/places/:id/review',reviewsRoutes)



app.get('/',(req,res)=>{
    res.render('Places/home')
})

app.get('/newPlace',async(req,res)=>{
    const newPlace = await new Place({
        title:'Scotland',
        price:'$200',
        description:'A beautiful place',
        locaion:'Earth'

    })
    // await newPlace.save()
    console.log(newPlace)
    res.send('New place has been added')
})




//reviews route


//handling 404 req
app.all('*',async(req,res,next)=>{
    next(new ExpressError('Page not found',404))
    // res.send(404)
})

//error handling
app.use((err,req,res,next)=>{
    const {statusCode=500} = err
    if(!err.message) err.message='Oh no! something went wrong'
    res.status(statusCode).render('error',{err})
})
app.listen(3000,(req,res)=>{
    console.log('App is running......')
})