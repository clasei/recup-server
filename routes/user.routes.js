const router = require("express").Router()
const User = require("../models/user.model")
// Recommendation model added to update totalSaved
const Recommendation = require("../models/recommendation.model")


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
    // console.log(newUser)
  } catch (error) {
    next(error)
  }
})


// | GET         | `/api/users/:userId`    | Read a specific user's profile                     |
router.get("/:userId", async (req, res, next) => {
  try {
    const specificUser = await User.findById(req.params.userId)
      .populate("savedRecs") // populates recommendations data when fetching the user
    res.status(200).json(specificUser);
  } catch (error) {
    next(error);
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


// | PUT         | `/api/users/:userId/save/:recommendationId`    | Save a recommendation and increment totalSaved               |
router.put("/:userId/save/:recommendationId", async (req, res, next) => {
  try {

    const user = await User.findById(req.params.userId);

    // guard clause to check if the recommendation is already saved
    if (user.savedRecs.includes(req.params.recommendationId)) {
      return res.status(400).json({ message: "this recommendation is already saved" });
    }

    // add the saved rec to the array savedRecs
    user.savedRecs.push(req.params.recommendationId)
    await user.save() // make sure the info in the database is persistent... it works, yay

    // increment totalSaved -> Recommendation model property
    await Recommendation.findByIdAndUpdate(
      req.params.recommendationId,

      // $inc added to increment the property (mongodb operator)
      { $inc: { totalSaved: 1 } },
      { new: true }
    )

    res.status(200).json({ message: "recommendation saved and totalSaved incremented +1", user });
  } catch (error) {
    next(error)
  }
})


// | PUT         | `/api/users/:userId/unsave/:recommendationId`    | Unsave a recommendation and decrement totalSaved               |
router.put("/:userId/unsave/:recommendationId", async (req, res, next) => {
  try {

    const user = await User.findById(req.params.userId);

    // remove recommendation from the user's saved list
    // use the recId params to return all array elements but that one
    user.savedRecs = user.savedRecs.filter(
      (recId) => recId.toString() !== req.params.recommendationId
    )
    await user.save()
   

    // decrement  totalSaved in Recommendation model
    await Recommendation.findByIdAndUpdate(
      req.params.recommendationId,
      { $inc: { totalSaved: -1 } },
      { new: true }
    );

    res.status(200).json({ message: "recommendation unsaved and totalSaved decremented by 1", user });
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