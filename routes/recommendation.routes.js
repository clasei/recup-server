const router = require("express").Router()
const Recommendation = require("../models/recommendation.model")
// content.model added to update totalRecommendations
const Content = require("../models/content.model")
const User = require("../models/user.model")

const { verifyToken } = require("../middlewares/auth.middlewares")


// | POST        | `/api/recommendations/content/:contentId`                   | Create a new recommendation for a existing content                     |
router.post("/content/:contentId", verifyToken, async (req, res, next) => {
  try {

    // check if the user already wrote a recommendation for this content... TEST TEST TEST THIS
    const existingRecommendation = await Recommendation.findOne({
      content: req.params.contentId,
      creator: req.payload._id
    });

    if (existingRecommendation) {
      return res.status(400).json({ message: "you already shared your feeling about this, do you want to update it? go to your dashboard" });
    }

    const newRec = await Recommendation.create({
      content: req.params.contentId, // use front-end route !!!
      // use token to add creator
      creator: req.payload._id,
      recTitle: req.body.recTitle,
      tagline: req.body.tagline,
      recText: req.body.recText
    })

    // increment +1 totalRecommendations in content
    await Content.findByIdAndUpdate(req.params.contentId, {
      $inc: { totalRecommendations: 1 }
    })

    // add the new rec to the createdRecs user array property
    await User.findByIdAndUpdate(req.payload._id, {
      $push: { createdRecs: newRec._id }
    })

    res.status(201).json({ newRec, message: "recommendation added, totalRecommendations updated" })
    // console.log(newRec)
  } catch (error) {
    next(error)
  }
})

// | POST | `/api/recommendations/new-content` | Create new content and a new recommendation |
router.post("/new-content", verifyToken, async (req, res, next) => {
  try {

    // check if content exists... integrate with the front in the future !!!
    const { category, title, mediaUrl } = req.body;
    const existingContent = await Content.findOne({ category, title });

    if (existingContent) {
      return res.status(400).json({ message: "this content already exists" });
    }

    const newContent = await Content.create({
      category: req.body.category,
      title: req.body.title,
      author: req.body.author,
      keywords: req.body.keywords,
      mediaUrl: mediaUrl,
      firstRecommendationCreator: req.payload._id
    })
    
    const newRec = await Recommendation.create({
      content: newContent._id,
      creator: req.payload._id,
      recTitle: req.body.recTitle,
      tagline: req.body.tagline,
      recText: req.body.recText
    })

    // increment +1 totalRecommendations in content
    await Content.findByIdAndUpdate(newContent._id, {
      $inc: { totalRecommendations: 1 }
    })

    // add the new rec to the createdRecs user array property
    await User.findByIdAndUpdate(req.payload._id, {
      $push: { createdRecs: newRec._id }
    })

    res.status(201).json({ newRec, newContent, message: "new content and first recommendation created, life is beautiful, isnt it?" });
  } catch (error) {
    next(error);
  }
})



// | GET         | `/api/recommendations`            | Read all recommendations                         |
router.get("/", async (req, res, next) => {
  try {
    const allRecs = await Recommendation.find()
    res.status(200).json(allRecs)
  } catch (error) {
    next(error)
  }
})


// | GET         | `/api/recommendations/:recommendationId` | Read details of a specific recommendation       |
router.get("/:recommendationId", async (req, res, next) => {
  try {
    const specificRec = await Recommendation.findById(req.params.recommendationId)
    .populate("content") // populates content info -> adapt later as needed... e.g. content.title
    .populate("creator") // populates rec-creator -> adapt later as needed... e.g. info creator.username
    res.status(200).json(specificRec)
  } catch (error) {
    next(error)
  }
})


// | GET         | `/api/recommendations/content/:contentId`        | Read all recommendations for a specific content |
router.get("/content/:contentId", async (req, res, next) => {
  try {
    const allRecsByContent = await Recommendation.find({ content: req.params.contentId })
      // .populate("content", "title") // populates content specific info
      .populate("creator", "username") // populates rec-creator specific info

    res.status(200).json(allRecsByContent);
  } catch (error) {
    next(error)
  }
})

// | GET         | `/api/recommendations/creator/:userId `       | Read all recommendations by a specific creator |
router.get("/creator/:userId", async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const createdRecs = await Recommendation.find({ creator: userId }).populate("content")
    res.status(200).json(createdRecs);
  } catch (error) {
    next(error);
  }
})

// // | GET         | `/api/recommendations/creator/:username`       | Username !!! Read all recommendations by a specific creator |
// router.get("/creator/:username", async (req, res, next) => {
//   try {
//     const { username } = req.params;
//     const user = await User.findOne({ username }).populate("createdRecs");

//     if (!user) {
//       return res.status(404).json({ message: "user not found" });
//     }
//     res.status(200).json(user.createdRecs);
//   } catch (error) {
//     next(error); 
//   }
// });




// | PUT         | `/api/recommendations/:recommendationId` | Update a specific recommendation                |
router.put("/:recommendationId", verifyToken, async (req, res, next) => {
  try {

    const recommendation = await Recommendation.findById(req.params.recommendationId);

    if (!recommendation) {
      return res.status(404).json({ message: "recommendation not found" });
    }

    // check that the one who updates is the rec-creator
    if (recommendation.creator.toString() !== req.payload._id) {
      return res.status(403).json({ message: "you shouldn't be touching other people stuff, right?" });
    }


    const updatedRec = await Recommendation.findByIdAndUpdate(
      req.params.recommendationId,
      {
        // content: req.body.content,
        // creator: req.body.creator, // no needed here
        recTitle: req.body.recTitle,
        tagline: req.body.tagline,
        recText: req.body.recText
        // add more fields if you change the model !!!
      },
      { new: true }
    )
      res.status(200).json(updatedRec)
  } catch (error) {
    next(error)
  }
})


// // MOVED TO user.model and integrated in route to add the rec to the savedRecs array haha

// // | PUT         | `/api/recommendations/:recommendationId/saved` | Increment totalSaved by 1               |
// router.put("/:recommendationId/saved", async (req, res, next) => {
//   try {

//     const increaseTotalSaved = await Recommendation.findByIdAndUpdate(
//       req.params.recommendationId,
//       {
//         // $inc added to increment the property (mongodb operator)
//         $inc: { totalSaved: 1 }
//       },
//       { new: true }
//     )
//     res.status(200).json({ increaseTotalSaved, message: "total saved +1" });
//   } catch (error) {
//     next(error);
//   }
// })


// // | PUT         | `/api/recommendations/:recommendationId/unsaved` | Decrease totalSaved by 1               |
// router.put("/:recommendationId/unsaved", async (req, res, next) => {
//   try {

//     const recommendation = await Recommendation.findById(req.params.recommendationId);
//     // guard clause added to avoid going below zero
//     if (recommendation.totalSaved > 0) {
//       const decreaseTotalSaved = await Recommendation.findByIdAndUpdate(
//         req.params.recommendationId,
//         {
//           $inc: { totalSaved: -1 }
//         },
//         { new: true }
//       )
//       res.status(200).json({ decreaseTotalSaved, message: "total saved -1" });
//     } else {
//       res.status(400).json({ message: "totalSaved cannot go below zero haha" });
//     }

//   } catch (error) {
//     next(error);
//   }
// })

// // MOVED TO user.model and integrated in route to add the rec to the savedRecs array haha


// | DELETE      | `/api/recommendations/:recommendationId` | Delete a specific recommendation                |
router.delete("/:recommendationId", verifyToken, async (req, res, next) => {
  try {

    const recommendation = await Recommendation.findById(req.params.recommendationId)

    // checks if the creator is the user deleting; someone else == forbidden
    if (recommendation.creator.toString() !== req.payload._id) {
      return res.status(403).json({ message: "you cannot delete this, it's not yours" })
    }

    // decrement totalRecommendations -1 in content
    await Content.findByIdAndUpdate(recommendation.content, {
      $inc: { totalRecommendations: -1 }
    })

    // delete recommendation after updating totalRecommendations
    await Recommendation.findByIdAndDelete(req.params.recommendationId)

    res.status(204).json({ message: "recommendation deleted, totalRecommendations updated" })
  } catch (error) {
    next(error);
  }
})



module.exports = router