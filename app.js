require("dotenv").config()
require("./db") // waiting for database

const express = require("express")
const app = express()

require("./config")(app) // waiting for config

const indexRoutes = require("./routes/index.routes")
app.use("/api", indexRoutes)

// require("./error-handling")(app) // waiting for error-handling

// // TEST
// app.get("/", (req, res) => {
//   res.send(`hey there this is rec-up-back-end`)
// })


module.exports = app