const Place = require('../Models/vaca')
//index
module.exports.index = async(req,res)=>{
    const places = await Place.find({})
    res.render('Places/places',{places})
}

//post new place
module.exports.createPlace=async(req,res)=>{
    // if(!req.body.places) throw new ExpressError('Invalid data',400)
    const newPlace = new Place(req.body.places)
    newPlace.author = req.user.id
    await newPlace.save()
    req.flash('success','Successfully made a new post')
    res.redirect(`/places/${newPlace.id}`)

}

//show page
module.exports.viewPlace = async(req,res)=>{
    const foundPlace = await Place.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
        }
    }).populate('author')
    
    console.log(foundPlace)
    if(!foundPlace){
        req.flash('error','Cannot find that place!')
        res.redirect('/places')
    }
    res.render('Places/show',{foundPlace,msg:req.flash('success')})
}


//edit page
module.exports.editForm = async(req,res)=>{
    const foundPlace = await Place.findById(req.params.id)
    if(!foundPlace){
        req.flash('error','Cannot find that place!')
        res.redirect('/places')
    }
    // if(!foundPlace.author.equals(req.user.id)){
    //     req.flash('error','You do not have permission!!')
    //     return res.redirect(`/places/${foundPlace.id}`)
    // }
    res.render('Places/edit',{foundPlace})
    console.log(foundPlace)
}


//put edit

module.exports.putEdit = async(req,res)=>{
    const edit = await Place.findByIdAndUpdate(req.params.id,{...req.body.places})
    req.flash('success','Successfully updated post')
    res.redirect(`/places/${edit.id}`)

}

//delete
module.exports.deletePlace = async(req,res)=>{
    const {id}=req.params
    await Place.findByIdAndDelete(id)
    req.flash('success','Post was deleted')
    res.redirect('/places')
}