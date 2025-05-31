const fs = require('fs');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
const config = require('./config.json');

const configuration = new Configuration({
  apiKey: config.openai_key,
});
const openai = new OpenAIApi(configuration);
const LOG_FILE = './TIHb-chat-log.txt';

function logToFile(content) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${content}\n`);
}

async function askGPT(message, username) {
  const prompt = `Ти — темна саркастична тінь ведучого, яка спілкується в чаті Twitch. Глядач "${username}" написав: "${message}". Що скажеш у відповідь?`;
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
    });
    const gptResponse = response.data.choices[0].message.content.trim();
    logToFile(`[GPT відповідає → ${username}]: ${gptResponse}`);
    return gptResponse;
  } catch (error) {
    console.error('GPT error:', error);
    return '...тихо аналізую. Помилка.';
  }
}

module.exports = { askGPT };