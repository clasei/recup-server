const mongoose = require("mongoose")

const recommendationSchema = new mongoose.Schema({
  content: { type: mongoose.Schema.Types.ObjectId, ref: "Content", required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true  },
  recTitle: { type: String, maxlength: 70, required: true },
  tagline: { type: String, maxlength: 120, required: true },
  recText: { type: String, maxlength: 4900, required: true },
  lengthCategory: { type: String, enum: ['short', 'medium', 'long'] },
  totalSaved: { type: Number, default: 0 }
},
{
  timestamps: true
})

const Recommendation = mongoose.model("Recommendation", recommendationSchema)

module.exports = Recommendation