
const fs = require('fs');
const { Configuration, OpenAIApi } = require('openai');
const viewerPath = './viewers.json';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

function saveViewer(username, message) {
  let viewers = {};
  try {
    viewers = JSON.parse(fs.readFileSync(viewerPath, 'utf-8'));
  } catch { viewers = {}; }

  if (!viewers[username]) viewers[username] = [];
  viewers[username].push(message);
  fs.writeFileSync(viewerPath, JSON.stringify(viewers, null, 2));
}

async function respond(tags, message) {
  const username = tags['username'];
  saveViewer(username, message);

  const prompt = `Ти — тінь стрімера, імʼя користувача: ${username}. Повідомлення: "${message}".
  Ти маєш бути або вдячна, або саркастична, або іронічна, як личить тіні. Враховуй історію.
  Відповідь коротко, не більше 200 символів, з характером.`;

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });
    return completion.data.choices[0].message.content.trim();
  } catch (e) {
    console.error('GPT error:', e.message);
    return null;
  }
}

module.exports = { respond };
