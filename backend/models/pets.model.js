const mongoose = require("mongoose");

const petsSchema = mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    type: {
      type: String,
      required: true,
      enum: ["dog", "cat", "bird", "small"],
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female"],
    },
    breed: { 
        type: String, 
        required: true 
    },
    age: { 
        type: Number,
         required: true
     },

    location: { 
        type: String, 
        required: true 
    },
  
    img: { 
        type: String, 
        required: true 
    },
    listingType: { 
        type: String, 
        required: true, 
        enum: ["adoption", "sale"] 
    },
    price: { 
        type: Number
     },
    ownerEmail: { 
        type: String, 
         require : true

     },
     ownerData : {
          type : Object,
          required : true
     },

  
    description: {
        type: String,
        required: true
    },

    createdAt: { 
        type: Date, 
        default: Date.now
     },
    updatedAt: { 
        type: Date,
         default: Date.now 
        },

        isDating:{
            type : Boolean,
            default : false
        }
  },
  {
    timestamps: true,
  }
  
);

const petModel = mongoose.model("Pet", petsSchema);
module.exports = petModel;
