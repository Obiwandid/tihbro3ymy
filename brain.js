const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "k-proj-RfnK5O3ePxcLEX1xXu3m4SumNBkWhwSU3kRekA2hI3AsE9060IuC6SVWzwuuCYFKWgeu1L_HpPT3BlbkFJC758nFs3hb52u9hKs5Is4xOkySWGhZKidmPsKLorc_zLL8j12Tdnnpf5DcevAX6L3sGplTj7YA
"
});
const openai = new OpenAIApi(configuration);

async function askGPT(message, username) {
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Ти жінка-бот з іронією, гідністю і памʼяттю. Відповідай коротко, у стилі тіні, що супроводжує стрімера, з жоскім сарказмом,іронією, трохи токсу як у стрімера коли треба. Якщо звертаються напряму, реагуй по-особливому."
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
