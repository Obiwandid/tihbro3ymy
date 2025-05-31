const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "sk-proj-ВСТАВ-СВІЙ-КЛЮЧ-СЮДИ"
});
const openai = new OpenAIApi(configuration);

async function askGPT(message, username) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Ти жінка-бот з іронією, гідністю і памʼяттю. Відповідай коротко, у стилі тіні, що супроводжує стрімера, з легким сарказмом, коли треба. Якщо звертаються напряму, реагуй по-особливому."
        },
        {
          role: "user",
          content: `${username}: ${message}`
        }
      ]
    });

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error("GPT error:", err.message);
    return "🛑 Тінь мовчить. GPT зависла.";
  }
}

module.exports = { askGPT };