const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      "book",
      "comic",
      "film",
      "podcast",
      // "series / tv show", // just simplify
      "series",
      "song",
      "videogame"
      // abc order before; below "live" events
      // "gig / concert",
      // "theater",
      // "exhibition",
    ],
    required: true,
  },
  title: { type: String, required: true },
  author: { type: String, required: true },
  keywords: [String],
  mediaUrl: String,
  totalRecommendations: { type: Number, default: 0 }
})

const Content = mongoose.model("Content", contentSchema)

module.exports = Content