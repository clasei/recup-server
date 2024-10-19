const { Schema, model } = require("mongoose");

const contentSchema = new Schema({
  category: {
    type: String,
    enum: [
      "book",
      "comic",
      "film",
      "podcast",
      "series",
      "song",
      "videogame"
    ],
    required: true,
  },
  title: { type: String, required: true },
  author: [{ type: String, required: true  }],
  keywords: [{ type: String }],
  mediaUrl: String,
  // here comes cloudinary...
  // media: {
  //   url: { type: String },          // Cloudinary URL
  //   publicId: { type: String },     // Public ID from Cloudinary
  //   format: { type: String }        // Optionally store file format
  // },
  totalRecommendations: { type: Number, default: 0 },
  firstRecommendationCreator:  { type: Schema.Types.ObjectId, ref: "User", required: true }
},
{
  timestamps: true
})

const Content = model("Content", contentSchema)

module.exports = Content