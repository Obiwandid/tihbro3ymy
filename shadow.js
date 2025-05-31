const tmi = require('tmi.js');
const fs = require('fs');
const { askGPT } = require('./brain.js');
const config = require('./config.json');

const LOG_FILE = './TIHb-chat-log.txt';

function logToFile(content) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${content}\n`);
}

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: config.username,
    password: config.password
  },
  channels: [config.channel]
});

client.connect().then(() => {
  console.log(`🟢 Підключено до Twitch-чату як ${config.username} → irc-ws.chat.twitch.tv:443`);
}).catch(console.error);

client.on('message', async (channel, tags, message, self) => {
  if (self || tags.username === 'streamelements') return;

  const username = tags['display-name'] || tags.username;
  const lowerMessage = message.toLowerCase();

  logToFile(`[${username}]: ${message}`);

  const triggers = ['де знижки', 'привіт', 'hello', 'де твій ведучий', 'ти тут', 'тінь'];

  if (triggers.some(trigger => lowerMessage.includes(trigger))) {
    const response = await askGPT(message, username);
    client.say(channel, `@${username} ${response}`);
  }
});