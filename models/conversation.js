const mongoose = require('mongoose');
const ConversationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  conversation: {
    type: Array,
    required: true,
  }
}, { versionKey: false, collection: 'conversations'});

const Conversation = mongoose.model('conversations', ConversationSchema);
module.exports = Conversation;
