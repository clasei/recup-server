const router = require("express").Router()
// // the line above is the same that the following 2...
// const express = require('express');
// const router = express.Router()

// const authRoutes = require("./auth.routes")
const contentRoutes = require("./content.routes")
const recommendationRoutes = require("./recommendation.routes")
// const userRoutes = require("./user.routes")

// // plural -> convention !!!
// router.use("/auth", authRoutes)
router.use("/contents", contentRoutes)
router.use("/recommendations", recommendationRoutes)
// router.use("/users", userRoutes)


// // TEST
// router.get("/", (req, res, next) => {
//   res.json(`hey there this is still rec-up-back-end`)
// })


module.exports = router