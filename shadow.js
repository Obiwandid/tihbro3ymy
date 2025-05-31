
const tmi = require('tmi.js');
const fs = require('fs');
const brain = require('./brain');
const events = require('./events');

const LOG_FILE = './TIHb-chat-log.txt';
function logToFile(content) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${content}\n`);
}

const username = process.env.TWITCH_USERNAME;
const password = process.env.TWITCH_OAUTH;
const channel = process.env.CHANNEL_NAME;

const client = new tmi.Client({
  identity: { username, password },
  channels: [channel]
});

client.connect().then(() => {
  console.log(`🟢 Підключено до Twitch-чату як ${username} → irc-ws.chat.twitch.tv:443`);
}).catch(console.error);

client.on('message', async (channel, tags, message, self) => {
  if (self || tags['username'].toLowerCase() === username.toLowerCase()) return;
  if (tags['username'] === 'streamelements') return;

  const response = await brain.respond(tags, message);
  if (response) {
    const final = `@${tags['display-name'] || tags['username']}: ${response}`;
    client.say(channel, final);
    logToFile(`[GPT відповідає → ${tags['username']}]: ${final}`);
  }
});

events.listen();
