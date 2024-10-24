const router = require("express").Router()
const User = require("../models/user.model")
// Recommendation model added to update totalSaved
const Recommendation = require("../models/recommendation.model")

const { verifyToken } = require("../middlewares/auth.middlewares")


// // TEMPORARY !!!
// // | POST        | `/api/users             | TESTING ONLY -- Creates a user                     |
// router.post("/", async (req, res, next) => {
//   try {
//     const newUser = await User.create({
//       username: req.body.username,
//       email: req.body.email,
//       socialLink: req.body.socialLink,
//       savedRecs: [] // empty for new users
//     })
//     res.status(201).json(newUser)
//     // console.log(newUser)
//   } catch (error) {
//     next(error)
//   }
// })


// | GET         | `/api/users/user-profile    | Read a specific user's profile + savedRecs + createdRecs, for dashboard and profile !!!!!!!!!!!
router.get("/user-profile/:userid", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.payload._id)

      // -------------------------- CHECK THIS !!!

      .populate("savedRecs")
      // .populate("createdRecs"); 

      .populate({
        path: "createdRecs",
        populate: {
          path: "content",    
        },
      })

      // -------------------------- CHECK THIS !!!

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // res.status(200).json(user); 

    res.status(200).json({
      username: user.username,
      name: user.name,
      lastName: user.lastName,
      socialLink: user.socialLink,
      savedRecs: user.savedRecs,
      createdRecs: user.createdRecs
    });
  } catch (error) {
    next(error)
  }
});

module.exports = router


// | GET         | `/api/users/:username`    | Read a specific user's profile + RECS -- users only |
router.get("/:username", verifyToken, async (req, res, next) => { // :userId changed to :username
  try {
    const specificUser = await User.findOne({ username: req.params.username }) // :userId changed to :username
      .populate("createdRecs")

    // // check if the user exists...  
    // if (!specificUser) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    res.status(200).json(specificUser)
  } catch (error) {
    next(error)
  }
})

// | GET | `/api/users/profile` | Get the logged-in user's profile and created recups |
router.get("/profile", verifyToken, async (req, res, next) => {
  try {
    // Use the ID from the token payload (req.payload._id) instead of relying on URL params
    const specificUser = await User.findById(req.payload._id)
    .populate("createdRecs")
    .populate("savedRecs");

    if (!specificUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(specificUser);
  } catch (error) {
    next(error);
  }
});

// // this route could be unnecessary now that we have createdRecs property
// // | GET | `/api/users/:userId/created-recommendations` | Get all recommendations created by a user -- users only |
// router.get("/:userId/created-recommendations", verifyToken, async (req, res, next) => {
//   try {
//     const createdRecs = await Recommendation.find({ creator: req.params.userId })
//     .populate("content") // bring content data
//     res.status(200).json(createdRecs)
//   } catch (error) {
//     next(error)
//   }
// })


// --------------------------- this could be managed using savedRecs and the route deleted...
// | GET | `/api/users/:userId/saved-recommendations` | Get all saved recommendations of a user (private) |
// router.get("/:userId/saved-recommendations", verifyToken, async (req, res, next) => {
//   try {
//     if (req.payload._id !== req.params.userId) {
//       return res.status(403).json({ message: "You cannot access someone else's saved recommendations." });
//     }

//     const user = await User.findById(req.params.userId).populate("savedRecs");
//     res.status(200).json(user.savedRecs)
//   } catch (error) {
//     next(error)
//   }
// })

// change this to manage an array in the client side
router.get("/:userId/saved-recommendations", verifyToken, async (req, res, next) => {
  try {
    if (req.payload._id !== req.params.userId) {
      return res.status(403).json({ message: "You cannot access someone else's saved recommendations." });
    }
    const user = await User.findById(req.params.userId)
      // .select('savedRecs'); // instead of .populate

      .select("savedRecs username") 
      .populate("savedRecs") 
      .populate({
        path: "savedRecs",
        populate: { path: "creator" },
      })
      
      // .populate("savedRecs") 
      // .populate({
      //   path: 'savedRecs',
      //   populate: { path: 'creator' } 
      // })

    res.status(200).json({ savedRecs: user.savedRecs, username: user.username });
  } catch (error) {
    next(error);
  }
});


router.get("/created/:username", async (req, res, next) => {
  try {
    const { username } = req.params;


    const user = await User.findOne({ username })
    // .populate("createdRecs");
    .populate({
      path: "createdRecs",
      populate: { path: "creator", select: "username" } 
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

 
    // res.status(200).json(user.createdRecs);
    res.status(200).json({
      createdRecs: user.createdRecs,
      name: user.name,
      lastName: user.lastName,
      socialLink: user.socialLink
    });
  } catch (error) {
    next(error);
  }
});







// | PUT         | `/api/users/:userId`    | Update a specific user's profile -- if it's owned                  |
router.put("/:userId", verifyToken, async (req, res, next) => {
  try {

    if (req.payload._id !== req.params.userId) {
      return res.status(403).json({ message: "you cannot change someone -- else's profile <3" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        name: req.body.name,
        lastName: req.body.lastName,
        socialLink: req.body.socialLink
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

    const user = await User.findById(req.params.userId)

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


// | DELETE      | `/api/users/:userId`    | Delete a specific user's account -- owned                   |
router.delete("/:userId", verifyToken, async (req, res, next) => {
  try {

    if (req.params.userId.toString() !== req.payload._id) {
      return res.status(403).json({ message: "you cannot delete this, it's not yours" })
    }

    await User.findByIdAndDelete(req.params.userId)
    res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})


module.exports = router