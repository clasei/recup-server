const router = require("express").Router()
const Content = require("../models/content.model")


// | GET         | `/api/contents`            | Read all content                         |
router.get("/", async (req, res, next) => {
  try {
    const allContents = await Content.find()
      .populate('firstRecommendationCreator', '_id username')
    res.status(200).json(allContents)
  } catch (error) {
    next(error)
  }
})


// | GET         | `/api/contents/:contentId` | Read specific content                    |
router.get("/:contentId", async (req, res, next) => {
  try {
    const specificContent = await Content.findById(req.params.contentId)
      // .populate('firstRecommendationCreator', '_id username') // THIS COULD BE NEEDED
    res.status(200).json(specificContent)
  } catch (error) {
    next(error)
  }
})

// | GET         | `/api/contents/search` | Search specific content by title
router.get("/search", async (req, res, next) => {
  try {
    const { title } = req.query;

    const contents = await Content.find({ title: new RegExp(`^${title}`, 'i') })
      .populate('author')

    res.status(200).json(contents);
  } catch (error) {
    next(error);
  }
})




module.exports = router