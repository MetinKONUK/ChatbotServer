const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
}, { versionKey: false, collection: 'users-collection'});

const User = mongoose.model('users-collection', UserSchema);
module.exports = User;
