const router = require("express").Router()

const { verifyToken, verifyAdmin } = require("../middlewares/auth.middlewares")


// GET route example for ADMIN
router.get("/test", verifyToken, verifyAdmin, (req, res) => {
  res.json({ message: "hey there admin" })
})

module.exports = router