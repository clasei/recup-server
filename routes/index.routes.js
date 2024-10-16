const router = require("express").Router()

router.get("/", (req, res, next) => {
  res.json(`hey there this is still rec-up-back-end`)
})

module.exports = router