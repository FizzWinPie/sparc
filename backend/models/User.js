import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },

  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  },

  firstName: { 
    type: String, 
    required: false, 
    unique: false 
  },
  
  phoneNumber: { 
    type: String, 
    required: true,
    unique: true, 
    sparse: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // simple validation for 10-digit phone numbers
      },
      message: props => `${props.value} is not a valid phone number!`
    }
   }, //optional field
  // createdAt: { 
  //   type: Date, 
  //   default: Date.now 
  // },
  },
  {
    timestamps: true, // automatically adds createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);

export default User;
