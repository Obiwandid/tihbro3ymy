
const { Configuration, OpenAIApi } = require('openai');
const fs = require('fs');
const config = require('./config.json');

const LOG_FILE = './TIHb-chat-log.txt';

function logToFile(content) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${content}\n`);
}

const configuration = new Configuration({
  apiKey: config.openai_key
});

const openai = new OpenAIApi(configuration);

async function askGPT(prompt, username) {
  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'Ти саркастична, розумна тінь ведучого на Twitch. Відповідай коротко, гостро,токсично кому треба або с сарказмом але в межах правил.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.8
    });

    const gptReply = response.data.choices[0].message.content;
    logToFile(`[GPT відповідає → ${username}]: ${gptReply}`);
    return gptReply;
  } catch (error) {
    console.error('GPT error:', error.response ? error.response.data : error.message);
    return '🛠 Зараз не можу відповісти. Здається, щось пішло не так.';
  }
}

module.exports = { askGPT };
