// const mongoose = require("mongoose")
// const Schema = mongoose.Schema
// const model = mongoose.model
// this 3 lines above are the same that the next line; no need to add it later if it's done now
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'hey, your email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'you need a password here']
    },
    username: {
      type: String,
      required: [true, 'remember to add your username']
    },
    socialLinks: [String],
    savedRecs: [{ type: Schema.Types.ObjectId, ref: "Recommendation" }]
  },
  {
    timestamps: true // automatically adds createdAt + updatedAt timestamps
  }
);

const User = model("User", userSchema)

module.exports = User


// // BEFORE...
// const userSchema = new mongoose.Schema(
//   {
//     username: { 
//       type: String, 
//       required: true, 
//       unique: true 
//     },
//     email: { 
//       type: String, 
//       required: true, 
//       unique: true 
//     },
//     socialLinks: [String],
//     savedRecs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' }]
//   }
// )

// const User = mongoose.model('User', userSchema)

// module.exports = User
