const mongoose = require("mongoose")

// mongodb will create a db with this name if it doesn't exist when running the app...
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/rec-up-db"

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    const dbName = x.connections[0].name
    console.log(`connected to mongo, yay, db name: ${dbName}`)
  })
  .catch((err) => {
    console.lerror("error connecting to mongo: ")
  })