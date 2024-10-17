const router = require("express").Router()
// // the line above is the same that the following 2...
// const express = require('express');
// const router = express.Router()


// // !!!!!!!!!!!!!!!!!!!!! JUST DO THIS LATER
// const verifyToken = require('../middlewares/verifyToken')

// // potential public routes... (accessible without a token)
// router.get("/public/recommendations", async (req, res, next) => {
//   try {
//     // Display limited recommendations to non-logged-in users
//     const publicRecs = await Recommendation.find()
//     res.status(200).json(publicRecs)
//   } catch (error) {
//     next(error)
//   }
// })

// // all routes after this line will require verification
// router.use(verifyToken)
// // !!!!!!!!!!!!!!!!!!!!! JUST DO THIS LATER

const adminRoutes = require("./admin.routes")
router.use("/admin", adminRoutes)

const authRoutes = require("./auth.routes")
router.use("/auth", authRoutes)

const contentRoutes = require("./content.routes")
router.use("/contents", contentRoutes)

const recommendationRoutes = require("./recommendation.routes")
router.use("/recommendations", recommendationRoutes)

const userRoutes = require("./user.routes")
router.use("/users", userRoutes)


// // TEST -- all good
// router.get("/", (req, res, next) => {
//   res.json(`hey there this is still rec-up-back-end`)
// })


module.exports = router