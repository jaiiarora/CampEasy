const express=require("express");
const mongoose=require("mongoose");
const path=require('path');
const bp = require("body-parser");
const methodOverride=require("method-override");
const ejsMate=require('ejs-mate');
//setting up ejs engine
const Campground=require('./models/campground');
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


app.get('/', (req,res)=>{
    res.send("Hello From CampEasy");
})

//hard coded for checking
app.get('/makecampground', async(req,res)=>{
    const camp=new Campground({title:"Test Campground", description:"Cheap Camping"});
    await camp.save();
    res.send(camp);
});
//tested and works connected database, works successfully
app.get('/campgrounds/new', async(req,res)=>{
    res.render('campgrounds/new');
});

app.get('/campgrounds/:id/edit', async(req,res)=>{
    const campground= await Campground.findById(req.params.id);
    res.render('campgrounds/edit', {campground});
});

app.get('/campgrounds/:id', async(req,res)=>{
    const campground= await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
});


app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
});


app.get('/campgrounds/new', async()=>{
    res.render('campgrounds/new');
});

app.put('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}); 

app.delete('/campgrounds/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds/`)
});

app.post('/campgrounds', async (req, res) => {
    const campground = new Campground(req.body.campground);
    console.log("Here");
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
    
 

app.get('/')
app.listen(3000, ()=> {
    console.log("Serving on Port:3000");
})
