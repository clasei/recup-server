const router = require("express").Router()
const Content = require("../models/content.model")


// | POST        | `/api/contents`            | Create new content (e.g., books, movies) |
router.post("/", async (req, res, next) => {
  try {
    const newContent = await Content.create({
      category: req.body.category,
      title: req.body.title,
      author: req.body.author,
      keywords: req.body.keywords,
      mediaUrl: req.body.mediaUrl
    })
    res.status(201).json(newContent)
    console.log(newContent)
  } catch (error) {
    next(error)
    // // check this syntax after error-handling setup !!!
    // next(new Error(`error creating new content: ${error}`))
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
    const updatedContent = Content.findByIdAndUpdate(
      req.params.contentId,
      {
        category: req.body.category,
        title: req.body.title,
        author: req.body.author,
        keywords: req.body.keywords,
        mediaUrl: req.body.mediaUrl
        // add more fields if you change the model !!!
      },
      { new: true}
    )
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