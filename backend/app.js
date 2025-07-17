const express = require("express")
const app = express()
const connectDB = require("./db/db")
const dotenv = require("dotenv").config()


app.use(express.json())
app.use(express.urlencoded({extended: true}))
connectDB()



app.get("/", (req , res)=>{
   res.send("wellcome to TailMate")
})
module.exports = app


