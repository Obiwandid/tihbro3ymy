
const tmi = require('tmi.js');
const fs = require('fs');
const { askGPT } = require('./brain.js');
const LOG_FILE = './TIHb-chat-log.txt';

function logToFile(content) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${content}\n`);
}

const config = {
  username: process.env.TWITCH_USERNAME,
  password: process.env.TWITCH_OAUTH,
  channels: [process.env.CHANNEL_NAME],
};

const client = new tmi.Client({
  identity: {
    username: config.username,
    password: config.password
  },
  channels: config.channels
});

client.connect().then(() => {
  console.log(`🟢 Підключено до Twitch-чату як ${config.username} → irc-ws.chat.twitch.tv:443`);
});

client.on('message', async (channel, tags, message, self) => {
  if (self || tags.username.toLowerCase() === config.username.toLowerCase()) return;
  const username = tags.username;
  const msg = message.trim();

  console.log(`💬 [${username}]: ${msg}`);

  const shouldRespond = /(привіт|hello|де знижки|де твій ведучий)/i.test(msg);
  if (!shouldRespond) return;

  const gptResponse = await askGPT(msg, username);
  const reply = `@${username} ${gptResponse}`;
  client.say(channel, reply);

  logToFile(`[GPT відповідає → ${username}]: ${gptResponse}`);
});
