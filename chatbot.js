const dialogflow = require('dialogflow');

const config = require('./devkey');
const privateKey = config.googlePrivateKey;
const projectId = config.googleProjectId;
const sessionId = config.dialogFlowSessionId;

const credentials = {
  client_email: config.googleClientEmail,
  private_key: config.googlePrivateKey
}

const sessionClient = new dialogflow.SessionsClient({projectId, credentials});

const chat = async (text, userId) => {
  const sessionPath = sessionClient.sessionPath(projectId, sessionId+userId);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: text,
        languageCode: config.dialogFlowSessinLanguageCode
      }
    }
  }
  try {
    const response = await sessionClient.detectIntent(request);
    return response;
  } catch (error) {
    console.error(error);
    return error;
  }
};

module.exports = {chat};