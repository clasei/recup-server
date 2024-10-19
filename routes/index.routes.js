const router = require("express").Router()


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

const uploadRoutes = require("./upload.routes")
router.use("/upload", uploadRoutes)

// // TEST -- all good
// router.get("/", (req, res, next) => {
//   res.json(`hey there this is still rec-up-back-end`)
// })


module.exports = router