const express = require("express")
const app = express()
const connectDB = require("./db/db")
require("dotenv").config()
const aiPetCareRoute = require("./routes/aiPetCare.route")
const mapRoute = require("./routes/maps.router")
const aidoctorRoute = require("./routes/aidoctor.router")
const petRoutes=  require("./routes/pet.router")
const cors = require("cors")
const authRoutes = require("./routes/auth.router");


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())
connectDB()

//routers 
app.use("/api" , aiPetCareRoute)
app.use("/maps" , mapRoute)
app.use("/api", aidoctorRoute)
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);


app.get("/", (req , res)=>{
   res.send("wellcome to TailMate")
})
module.exports = app


