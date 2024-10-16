const jwt = require("jsonwebtoken")

function verifyToken (req, res, next) {

  // show HTTP request headers details (authorization, metadata,content-type...) -- check data arrives
  // console.log(req.headers)

  try {

    // split authorization header: JWT TOKENS are usually sent as a Bearer token -> token comes in 2nd posiiton + after the space " " == tokenArr[1]
    const tokenArr = req.headers.authorization.split(" ")
    const token = tokenArr[1]

    // verify the token and ads the payload to the request object
    const payload = jwt.verify(token, process.env.TOKEN_SECRET)
    req.payload = payload

    next() // keeps going if the token exists and its valid
    
  } catch (error) {
    res.status(401).json({ message: "invalid or non-existent token" })
  }
}

module.exports = verifyToken