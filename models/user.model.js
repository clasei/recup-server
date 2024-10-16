const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  socialLinks: [String],
  savedRecs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recommendation' }]
})

const User = mongoose.model('User', userSchema)

module.exports = User
