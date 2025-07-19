const express = require("express")
const app = express()
const connectDB = require("./db/db")
require("dotenv").config()
const aiPetCareRoute = require("./routes/aiPetCare.route")
const core  = require("cors")


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(core())
connectDB()

//routers 
app.use("/api" , aiPetCareRoute)



app.get("/", (req , res)=>{
   res.send("wellcome to TailMate")
})
module.exports = app


