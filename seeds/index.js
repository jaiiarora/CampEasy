const mongoose=require("mongoose");
const path=require('path');
//setting up ejs engine
const Campground=require('../models/campground');
const cities=require("./cities");
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

const seedDB= async ()=>{
    await Campground.deleteMany({});
    for (let i=0; i<50;i++)
    {
        const random1000=Math.floor(Math.random()*1000);
        console.log(cities[random1000].city);
        //mark the backticks here
        const randCamp = new Campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`});
        await (randCamp.save());
    }
}
seedDB();