
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function askGPT(message, username) {
  const prompt = `Користувач ${username} сказав: "${message}". Відповідай як темна, стильна тінь ведучого, з сарказмом і гідністю.`;
  const response = await openai.createChatCompletion({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'Ти — темна тінь ведучого на Twitch. Говори різко, лаконічно, але з харизмою. Не порушуй правил Twitch.' },
      { role: 'user', content: prompt },
    ],
  });

  return response.data.choices[0].message.content.trim();
}

module.exports = { askGPT };
