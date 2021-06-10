const express=require("express");
const app=express();
const path=require('path');
//setting up ejs engine
app.set("view engine", 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/', (req,res)=>{
    res.send("Hello From CampEasy");
})
app.listen(3000, ()=> {
    console.log("Serving on Port:3000");
})
