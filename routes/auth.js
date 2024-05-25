// routes/auth.js
const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const auth = require('../middleware/auth')

const router = express.Router()

const JWT_SECRET = 'your_jwt_secret' // Store this in environment variables

// Signup route
router.post('/signup', async (req, res) => {
  const {username, name, password, gender, location} = req.body
  try {
    let user = await User.findOne({username})
    if (user) {
      return res.status(400).json({msg: 'User already exists'})
    }

    user = new User({
      username,
      name,
      password,
      gender,
      location,
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    res.send('User registered')
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Login route
router.post('/login', async (req, res) => {
  const {username, password} = req.body
  try {
    const user = await User.findOne({username})
    if (!user) {
      return res.status(400).json({msg: 'Invalid credentials'})
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({msg: 'Invalid credentials'})
    }

    const payload = {
      user: {
        id: user.id,
      },
    }

    jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'}, (err, token) => {
      if (err) throw err
      res.json({token})
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

// Get user details
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }
})

module.exports = router
