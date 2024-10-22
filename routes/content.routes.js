const router = require("express").Router()
const Content = require("../models/content.model")

// const { verifyToken } = require("../middlewares/auth.middlewares")


///////// LINES BELOW NOT NEEDED CAUSE THE CONTENT WILL BE CHECKED AND CREATED IN REC ROUTES + FRONT
///////// LINES BELOW NOT NEEDED CAUSE THE CONTENT WILL BE CHECKED AND CREATED IN REC ROUTES + FRONT

// IDEA === this will be solved in the front: call API (all contents), filter (cateogires), search (characters, waiting), useEffect... === this route is just for test
// | GET        | `/api/contents/check-content`      | Check if content exists by category and title  |
// router.get("/check-content", async (req, res, next) => {
//   try {

//     const { category, title } = req.body

//     const existingContent = await Content.findOne({ category, title })

//     if (existingContent) {
//       return res.status(200).json({ message: "this content already exist" })
//     }
//     // if content does not exist the rest of the details should be reqeusted...
//     return res.status(400).json({ message: "let's create some new content" })

//   } catch (error) {
//     next(error);
//   }
// })

// // | POST        | `/api/contents`            | Create new content (e.g., books, movies) |
// router.post("/", verifyToken, async (req, res, next) => {
//   try {

//     const { category, title } = req.body

//     // check if content exists, guard clause
//     const existingContent = await Content.findOne({ category, title });

//     if (existingContent) {
//       return res.status(400).json({ message: "this content already exists" })
//     }

//     const newContent = await Content.create({
//       category: req.body.category,
//       title: req.body.title,
//       author: req.body.author,
//       keywords: req.body.keywords,
//       mediaUrl: req.body.mediaUrl,
//       // userId comes from token + validation at the same time, yay
//       firstRecommendationCreator: req.payload._id 
//     })
//     res.status(201).json(newContent)
//     // console.log(newContent)
//   } catch (error) {
//     next(error)
//   }
// })

///////// LINES ABOVE NOT NEEDED CAUSE THE CONTENT IS CREATED IN THE REC ROUTE
///////// LINES ABOVE NOT NEEDED CAUSE THE CONTENT IS CREATED IN THE REC ROUTE


// | GET         | `/api/contents`            | Read all content                         |
router.get("/", async (req, res, next) => {
  try {
    const allContents = await Content.find()
      .populate('firstRecommendationCreator', '_id username') // NEED TO ACCESS THIS DATA IN THE CLIENT !!!
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

// | GET         | `/api/contents/searc` | Search specific content by title
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