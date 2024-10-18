const router = require("express").Router()

const Content = require("../models/content.model");
const User = require("../models/user.model");
const Recommendation = require("../models/recommendation.model")

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")


// // GET route example for ADMIN
// router.get("/test", verifyToken, verifyAdmin, (req, res) => {
//   res.json({ message: "hey there admin" })
// })



// -------------------------- USERS --------------------------------------------------

// | GET         | `/api/admin/user/all-users`            | Fetch all users                       |
router.get("/user/all-users", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const allUsers = await User.find({}, '_id username email role') // only retrieves specific info
    res.status(200).json(allUsers)
  } catch (error) {
    next(error)
  }
})

// | PUT         | `/api/admin/user/:userId/make-admin`    | Turn user into admin                |
router.put("/user/:userId/make-admin", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        role: "admin"
      },
      { new: true }
    )

    // if (!updatedUser) {
    //   return res.status(404).json({ message: "user not found" }) // add this after testing
    // }

    res.status(200).json({ message: "here comes the new admin: ", user: updatedUser });
  } catch (error) {
    next(error);
  }
})

// | PUT         | `/api/admin/user/:userId/make-admin-user-again`    | Turn admin into user                |
router.put("/user/:userId/make-admin-user-again", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        role: "user"
      },
      { new: true }
    )

    res.status(200).json({ message: "this user used to be an admin: ", user: updatedUser });
  } catch (error) {
    next(error);
  }
})

// | DELETE      | `/api/admin/user/:userId/delete` | Delete specific content  
router.delete("/user/:userId/delete", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})


// -------------------------- CONTENT --------------------------------------------------

// | GET | `/api/admin/content/all-contents` | Fetch all content for admin panel |
router.get("/content/all-contents", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const allContents = await Content.find({}, '_id title category author');
    res.status(200).json(allContents);
  } catch (error) {
    next(error)
  }
})

// | PUT         | `/api/admin/content/:contentId/update` | Update specific content                  |
router.put("/:contentId", verifyToken, verifyAdmin, async (req, res, next) => {
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

// | DELETE      | `/api/admin/content/:contentId/delete` | Delete specific content  
router.delete("/content/:contentId/delete", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    await Content.findByIdAndDelete(req.params.contentId)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

// -------------------------- RECOMMENDATIONS --------------------------------------------------

// | GET         | `/api/admin/recommendation/all-recommendations`            | Fetch all recommendations                       |
router.get("/recommendation/all-recommendations", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    const allRecs = await Recommendation.find({}, '_id recTitle tagline recText creator')
    res.status(200).json(allRecs)
  } catch (error) {
    next(error)
  }
})

// | DELETE      | `/api/admin/recommendation/:recommendationId/delete` | Delete specific content  
router.delete("/recommendation/:recommendationId/delete", verifyToken, verifyAdmin, async (req, res, next) => {
  try {
    await Recommendation.findByIdAndDelete(req.params.recommendationId)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})



module.exports = router