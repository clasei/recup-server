const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: [
      "book",
      "comic",
      "song",
      "film",
      "series / tv show",
      "videogame",
      "podcast"
      // "gig / concert", // add coma(,) above if used
      // "theater",
      // "exhibition",
    ],
    required: true,
  },
  title: { type: String, required: true },
  author: { type: String, required: true },
  keywords: [String],
  mediaUrl: String
  // totalRecommendations // to be added -- virtual ?
})

const Content = mongoose.model("Content", contentSchema)

module.exports = Content