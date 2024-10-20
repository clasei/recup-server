const { Schema, model } = require("mongoose");

const contentSchema = new Schema({
  category: {
    type: String,
    enum: [
      "book",
      "comic",
      "movie",
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
  mediaUrl: { type: String, required: true }, // content needs media xd
  // // just in case
  // media: {
  //   url: { type: String }, // cloudinary URL
  //   publicId: { type: String }, // cloudinary publicId
  //   format: { type: String } // format could be useful
  // },
  totalRecommendations: { type: Number, default: 0 },
  firstRecommendationCreator:  { type: Schema.Types.ObjectId, ref: "User", required: true },
  firstRecupByContentCreator: { type: Boolean, default: false }
},
{
  timestamps: true
})

const Content = model("Content", contentSchema)

module.exports = Content