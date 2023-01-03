const express = require('express');
const mongoose = require('mongoose');
const chatbot = require('./chatbot');

const cors = require('cors');
const app = express();
const UserModel = require('./models/user');
const ConversationModel = require('./models/conversation');

mongoose.set('strictQuery', false);
app.use(express.json());

const corsOptions = {
  origin: '*',
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
const CONN_STR = 'mongodb+srv://crystalin:crystalin@crystalin.w93y0ww.mongodb.net/chatbot?retryWrites=true&w=majority';
mongoose.connect(CONN_STR);

app.get('/read-conversation/:email', async (req, res) => {
  const { email } = req.params;
  const result = await ConversationModel.find({ email: email}).exec();
  res.send(result);
});

app.post('/insert-conversation', async (req, res) => {
  const {email , question, answer } = req.body;
  console.log(email, question, answer);
  const data = {
    question: question,
    answer: answer,
  }
  ConversationModel.updateOne(
    { email: email }, 
    { $push: { conversation: data } },
  ).then().catch(error => console.log(error));

});

app.post('/chat', async (req, res) => {
  const { text, userId } = req.body;
  const result = await chatbot.chat(text, userId);
  const data = {
    response: result[0].queryResult.fulfillmentText
  };

  res.send(data);
});


app.post('/insert-user', async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password
  };
  const user = new UserModel(data);
  const convs = {
    email: req.body.email,
    conversation: [],
  }
  const conversation = new ConversationModel(convs);
  try {
    await conversation.save();
    await user.save();
    res.send({ status: true });
  } catch (error) {
    res.send({ status: false, error: error });
    console.error(error);
  }
});

app.get('/read-user/:email', async (req, res) => {
  const { email } = req.params;
  if (email === 'all') {
    UserModel.find({}, (error, result) => {
      if (error) {
        res.send(error);
      } else {
        res.send(result);
      }
    });
  } else {
    const result = await UserModel.find({ email: email}).exec();
    res.send(result);
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`PORT: ${PORT}`);
});
