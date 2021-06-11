const express=require("express");
const mongoose=require("mongoose");
const path=require('path');
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

app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req,res)=>{
    res.send("Hello From CampEasy");
})

//hard coded for checking
app.get('/makecampground', async(req,res)=>{
    const camp=new Campground({title:"Test Campground", description:"Cheap Camping"});
    await camp.save();
    res.send(camp);
})
//tested and works connected database, works successfully


app.get('/')
app.listen(3000, ()=> {
    console.log("Serving on Port:3000");
})
