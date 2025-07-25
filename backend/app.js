const express = require("express")
const app = express()
const connectDB = require("./db/db")
require("dotenv").config()
const aiPetCareRoute = require("./routes/aiPetCare.route")
const mapRoute = require("./routes/maps.router")
const likeRoute = require("./routes/like.router")
const aidoctorRoute = require("./routes/aidoctor.router")
const petRoutes=  require("./routes/pet.router")
const chatRoutes = require("./routes/chat.router")
const cors = require("cors")
const authRoutes = require("./routes/auth.router");
const ownerDatingRoutes = require("./routes/owenerdating.router");


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
app.use("/api/dating-pets", petRoutes);
app.use("/api/owner-dating", ownerDatingRoutes);

app.use("/api/likes", likeRoute);
app.use("/api/chats", chatRoutes);


app.get("/", (req , res)=>{
   res.send("wellcome to TailMate")
})
module.exports = app


