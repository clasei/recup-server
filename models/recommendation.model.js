const mongoose = require("mongoose")

const recommendationSchema = new mongoose.Schema({
  content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true  },
  tagline: { type: String, required: true },
  recText: { type: String, required: true },
  // totalSaved // to be added -- virtual ?
})

const Recommendation = mongoose.model("Recommendation", recommendationSchema)

module.exports = Recommendation