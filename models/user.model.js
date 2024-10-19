const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    role: {
      type: String,
      // enum: ["user", "admin", "superadmin", "moderator"],
      enum: ["user", "admin"]
      // default: "user" // added in post new api call !!!
      // required: true // ??
    },
    email: {
      type: String,
      required: [true, 'hey, your email is required'],
      trim: true,
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
    name: { type: String },
    lastName: { type: String },
    // socialLinks: [String], // check
    socialLink: { type: String, trim: true },
    savedRecs: [{ type: Schema.Types.ObjectId, ref: "Recommendation" }],
    createdRecs: [{ type: Schema.Types.ObjectId, ref: "Recommendation" }]
  },
  {
    timestamps: true
  }
)

const User = model("User", userSchema)

module.exports = User