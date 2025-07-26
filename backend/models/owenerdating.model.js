const mongoose = require("mongoose");
const { Schema } = mongoose;

const ownerDatingSchema = new Schema(
  {
    // User information (extended from user.model.js)
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },


  ProfilePicture: { 
      type: String 
  },
  images: [{ 
      type: String 
  }],
    
    // Dating profile specific information
    OwnerAge: { 
      type: Number, 
      required: true,
      min: 18
    },
    gender: { 
      type: String, 
      required: true,
      enum: ["Male", "Female", "Non-binary", "Other"]
    },
    location: { 
      type: String, 
      required: true 
    },
    bio: { 
      type: String,
      maxlength: 500
    },
    
    // Additional profile information
    interests: [{ 
      type: String 
    }],
    hobbies: [{ 
      type: String 
    }],
    occupation: { 
      type: String 
    },
    education: { 
      type: String 
    },


 
    // Location data for matching
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        index: "2dsphere"
      }
    },
    
    // Dating activity
    isOwnerDating: {
      type: Boolean,
      default: true
    },

    // Matching data
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OwnerDating' }],
    passes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OwnerDating' }],
    matches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OwnerDating' }],
    
    // Profile status
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);



const OwnerDating = mongoose.model("OwnerDating", ownerDatingSchema);
module.exports = OwnerDating;