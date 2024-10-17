const router = require("express").Router()
const Recommendation = require("../models/recommendation.model")
// content.model added to update totalRecommendations
const Content = require("../models/content.model")


// | POST        | `/api/recommendations`                   | Create a new recommendation                     |
router.post("/", async (req, res, next) => {
  try {
    const newRec = await Recommendation.create({
      content: req.body.content,
      creator: req.body.creator,
      tagline: req.body.tagline,
      recText: req.body.recText
    })

    // increment +1 totalRecommendations in content
    await Content.findByIdAndUpdate(req.body.content, {
      $inc: { totalRecommendations: 1 }
    })

    res.status(201).json({ newRec, message: "recommendation added, totalRecommendations updated" })
    // console.log(newRec)
  } catch (error) {
    next(error)
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
      .populate("content") // populates content info
      .populate("creator") // populates rec-creator info
    res.status(200).json(allRecsByContent);
  } catch (error) {
    next(error)
  }
})


// | PUT         | `/api/recommendations/:recommendationId` | Update a specific recommendation                |
router.put("/:recommendationId", async (req, res, next) => {
  try {
    const updatedRec = await Recommendation.findByIdAndUpdate(
      req.params.recommendationId,
      {
        content: req.body.content,
        creator: req.body.creator,
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
// router.delete("/:recommendationId", async (req, res, next) => {
//   try {

//     await Recommendation.findByIdAndDelete(req.params.recommendationId)

//     // decrement -1 totalRecommendations in the Content model
//     await Content.findByIdAndUpdate(req.body.content, {
//       $inc: { totalRecommendations: -1 }
//     })

//     res.sendStatus(204)
//   } catch (error) {
//     next(error)
//   }
// })

router.delete("/:recommendationId", async (req, res, next) => {
  try {

    const recommendation = await Recommendation.findById(req.params.recommendationId);

    // decrement totalRecommendations -1 in content
    await Content.findByIdAndUpdate(recommendation.content, {
      $inc: { totalRecommendations: -1 }
    })

    // delete recommendation after updating totalRecommendations
    await Recommendation.findByIdAndDelete(req.params.recommendationId)

    res.status(204).json({ message: "recommendation deleted, totalRecommendations updated" });
  } catch (error) {
    next(error);
  }
});




module.exports = router