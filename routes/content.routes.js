const router = require("express").Router()
const Content = require("../models/content.model")

const { verifyToken } = require("../middlewares/auth.middlewares")


// | POST        | `/api/recommendations/check-content`      | Check if content exists by category and title  |
router.post("/check-content", async (req, res, next) => {
  try {

    const { category, title } = req.body

    const existingContent = await Content.findOne({ category, title });

    if (existingContent) {
      return res.status(200).json({ message: "this content already exist" }); 
    }
    // if content does not exist the rest of the details should be reqeusted...
    return res.status(200).json({ message: "let's create some new content" });

  } catch (error) {
    next(error);
  }
})


// | POST        | `/api/contents`            | Create new content (e.g., books, movies) |
router.post("/", verifyToken, async (req, res, next) => {
  try {
    const newContent = await Content.create({
      category: req.body.category,
      title: req.body.title,
      author: req.body.author,
      keywords: req.body.keywords,
      mediaUrl: req.body.mediaUrl,
      // userId comes from token + validation at the same time, yay
      firstRecommendationCreator: req.payload._id 
    })
    res.status(201).json(newContent)
    // console.log(newContent)
  } catch (error) {
    next(error)
  }
})


// | GET         | `/api/contents`            | Read all content                         |
router.get("/", async (req, res, next) => {
  try {
    const allContents = await Content.find()
    res.status(200).json(allContents)
  } catch (error) {
    next(error)
  }
})


// | GET         | `/api/contents/:contentId` | Read specific content                    |
router.get("/:contentId", async (req, res, next) => {
  try {
    const specificContent = await Content.findById(req.params.contentId)
    res.status(200).json(specificContent)
  } catch (error) {
    next(error)
  }
})


// | PUT         | `/api/contents/:contentId` | Update specific content                  |
router.put("/:contentId", async (req, res, next) => {
  try {
    const updatedContent = await Content.findByIdAndUpdate(
      req.params.contentId,
      {
        category: req.body.category,
        title: req.body.title,
        author: req.body.author,
        keywords: req.body.keywords,
        mediaUrl: req.body.mediaUrl
        // add more fields if you change the model !!!
      },
      { new: true }
    )
      res.status(200).json(updatedContent)
  } catch (error) {
    next(error)
  }
})


// | DELETE      | `/api/contents/:contentId` | Delete specific content  
router.delete("/:contentId", async (req, res, next) => {
  try {
    await Content.findByIdAndDelete(req.params.contentId)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})



module.exports = router