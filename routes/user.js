const express = require('express')
const router = express.Router()
const catchAsync = require('../utilis/catchAsync')
const User = require('../Models/user')
const passport = require('passport')

router.get('/register',(req,res)=>{
    res.render('user/register')
})

router.post('/register', catchAsync(async(req,res,next)=>{
    try{
    const {username,email,password} = req.body
    const newUser = new User({email,username})
    const userRegistered = await User.register(newUser,password)
    req.login(userRegistered,err=>{
        if(err){
            return next(err)
        }
        console.log(userRegistered)
        req.flash('success','Welcome to VACA')
        res.redirect('/places')
    })

    }catch(e){
        req.flash('error',e.message)
        res.redirect('/register')
    }

}))

router.get('/login',(req,res)=>{
    res.render('user/login')
})

router.post('/login',passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),(req,res)=>{
    req.flash('success','Welcome User')
    const redirectUrl = req.session.returnTo || '/places'
    delete req.session.returnTo
    console.log(req.user)
    res.redirect(redirectUrl)
})

router.get('/logout',(req,res)=>{
    req.logout()
    req.flash('success','Logged you out!')
    res.redirect('/places')
})
module.exports = router 