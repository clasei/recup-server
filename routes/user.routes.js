const router = require("express").Router()
const User = require("../models/user.model")


// TEMPORARY !!!
// | POST        | `/api/users             | TESTING ONLY -- Creates a user                     |
router.post("/", async (req, res, next) => {
  try {
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      socialLinks: req.body.socialLinks,
      savedRecs: [] // empty for new users
    })
    res.status(201).json(newUser)
    console.log(newUser)
  } catch (error) {
    next(error)
  }
})


// | GET         | `/api/users/:userId`    | Read a specific user's profile                     |
router.get("/:userId", async (req, res, next) => {
  try {
    const specificUser = await User.findById(req.params.userId)
    res.status(200).json(specificUser)
  } catch (error) {
    next(error)
  }
})


// | PUT         | `/api/users/:userId`    | Update a specific user's profile                   |
router.put("/:userId", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        username: req.body.username,
        email: req.body.email,
        socialLinks: req.body.socialLinks
        // savedRecs: [] // removed cause it won't be updated here - is this ok ?
        // add more fields if you change the model !!!
      },
      { new: true }
    )
      res.status(200).json(updatedUser)
  } catch (error) {
    next(error)
  }
})


// | DELETE      | `/api/users/:userId`    | Delete a specific user's account                   |
router.delete("/:userId", async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.userId)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})


module.exports = router