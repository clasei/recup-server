const router = require("express").Router()
const User = require("../models/user.model") // user model is (clearly) involved !!! 

const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const verifyToken = require('../middlewares/auth.middlewares')


// | POST        | `/api/auth/signup`      | Register a new user and encrypt the password, create user in db     |
router.post("/signup", async (req, res, next) => {

  // console.log(req.body)
  const { email, password, username } = req.body

  // back-end validations start here

  if (!email || !password || !username) {
    res.status(400).json({message: "Todos los campos son requeridos"})
    return // this stops the function == guard clause
  }

  const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,16}$/gm
  if (!regexPassword.test(password)) {
    res.status(400).json({message: "your pass needs 1 capital letter, 1 lowercase, 1 number and 8-16 characters length"})
    return
  }

  // ADD HERE AN EMAIL STRUCTURE VERIFICATION TO MAKE SURE THE EMAIL IS AN EMAIL !!! to be done
  
  try {

    const foundUser = await User.findOne({ email: email })
    if (foundUser) {
      res.status(400).json({message: "this email already exists, and it's probably you"})
      return
    }

    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)
    
    await User.create({
      email,
      password: hashPassword,
      username
    })

    res.sendStatus(201)
  } catch (error) {
    next(error)
  }
})


// | POST        | `/api/auth/login`       | Authenticate a user and return a JWT token aka virtual key        |
router.post("/login", async (req, res, next) => {

  const { email, password } = req.body
  // console.log(email, password)

  // checks all required fields have info
  if (!email || !password) {
    res.status(400).json({message: "all fields are require"})
    return 
  }

  try {
    
    // validate user in database
    const foundUser = await User.findOne({email: email})
    // console.log(foundUser)
    if (!foundUser) {
      res.status(400).json({message: "no user found with this email"})
      return 
    }

    // validate password
    const isPasswordCorrect = await bcrypt.compare(password, foundUser.password )
    if (!isPasswordCorrect) {
      res.status(400).json({message: "wrong password"})
      return 
    }

    // send virtual key to authenticated user
    const payload = {
      _id: foundUser._id,
      email: foundUser.email

      // ADD HERE EVERY PROPERTY THAT IDENTIFIES THE USER AND/OR PROVIDES SUPERPOWERS !!!
    }

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "7d" // 7 days; it could be different
    })
    res.status(200).json({ authToken: authToken })
    
  } catch (error) {
    next(error)
  }
})


// | GET         | `/api/auth/verify`      | Verify the user token and return the user data when the user access again    |

router.get("/verify", verifyToken, (req, res) => {

  // console.log(req.payload) 
  res.status(200).json(req.payload)
  // all routes using verifyToken middleware will have access to know the user who makes the calls...
  // and the front-end will know who is surfing the site, yay

})



module.exports = router