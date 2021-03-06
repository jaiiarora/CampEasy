const express=require("express");
const mongoose=require("mongoose");
const path=require('path');
const bp = require("body-parser");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
const catchAsync=require('./utils/catchAsync');
const Joi=require('joi');
//setting up ejs engine
const Campground=require('./models/campground');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const ExpressError=require('./utils/ExpressError');
const { join } = require("path");
const Review=require('./models/review')
mongoose.connect("mongodb://localhost:27017/camp-easy",{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology:true
});

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open",()=>{
    console.log("Database Connected");
});


const app=express();
app.engine('ejs',ejsMate);
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));
app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
};

app.get('/', (req,res)=>{
    res.send("Hello From CampEasy");
})

//hard coded for checking
app.get('/makecampground',catchAsync(async(req,res)=>{
    const camp=new Campground({title:"Test Campground", description:"Cheap Camping"});
    await camp.save();
    res.send(camp);
}));
//tested and works connected database, works successfully
app.get('/campgrounds/new',catchAsync( async(req,res)=> {
    res.render('campgrounds/new');
}));

app.get('/campgrounds/:id/edit', catchAsync(async(req,res)=>{
    const campground= await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
}));

app.get('/campgrounds/:id',catchAsync( async(req,res)=>{
    const campground= await Campground.findById(req.params.id).populate('reviews');
    console.log('Campground');
    res.render('campgrounds/show', {campground});
}));


app.get('/campgrounds', catchAsync( async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}));


app.get('/campgrounds/new', catchAsync(async()=>{
    res.render('campgrounds/new');
}));

app.put('/campgrounds/:id',catchAsync( async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
})); 

app.delete('/campgrounds/:id', catchAsync (async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds/`)
}));

app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next)=>{
       // if (!req.body.campground) throw (new ExpressError('Invalid Campground', 400));
       const campground = new Campground(req.body.campground); 
       await campground.save();
        res.redirect(`/campgrounds/${campground._id}`)    
}));

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async(req,res, next)=>{
    const campground=await(Campground.findById(req.params.id));
    const review=new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.all('*', (req,res,next)=>{
    next(new ExpressError('Page not Found', 404));
})
 
app.use((err, req, res, next)=>{
    
    const {statusCode=500, message}=err;
    if (!err.message)
    {
        err.message="Something Went Wrong";
    }
    res.status(statusCode).render('error',{err});
})

app.listen(3000, ()=> {
    
    console.log("Serving on Port:3000");
})
