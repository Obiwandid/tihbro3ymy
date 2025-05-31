
const tmi = require('tmi.js');
const fs = require('fs');
const config = require('./config.json');
const brain = require('./brain.js');

const viewersFile = './viewers.json';
const LOG_FILE = './TIHb-chat-log.txt';

function logToFile(content) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(LOG_FILE, `[${timestamp}] ${content}\n`);
}

let viewers = {};

// Завантаження памʼяті
if (fs.existsSync(viewersFile)) {
  viewers = JSON.parse(fs.readFileSync(viewersFile, 'utf8'));
}

// Налаштування клієнта
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username: config.username,
    password: config.oauth
  },
  channels: [config.channel]
});

client.connect().then(() => {
  console.log(`🟢 Підключено до Twitch-чату як ${config.username} → irc-ws.chat.twitch.tv:443`);
  logToFile(`🟢 Підключено до чату як ${config.username}`);
});

client.on('message', (channel, tags, message, self) => {
  const username = tags['username'].toLowerCase();

  // 🛑 Не реагувати на саму себе
  if (username === config.username.toLowerCase()) return;

  // Запамʼятати глядача
  if (!viewers[username]) {
    viewers[username] = {
      messages: [],
      count: 0,
      lastSeen: new Date().toISOString()
    };
  }

  viewers[username].count++;
  viewers[username].lastSeen = new Date().toISOString();
  viewers[username].messages.push(message);

  fs.writeFileSync(viewersFile, JSON.stringify(viewers, null, 2));

  const msg = message.toLowerCase();

  if (msg.includes('де знижки')) {
    const reply = `@${username} Це не супермаркет, це культ. У нас лише підвищення тиску.`;
    client.say(channel, reply);
    logToFile(`[GPT відповідає → ${username}]: ${reply}`);
  } else if (msg.includes('привіт') || msg.includes('hello')) {
    const reply = `@${username} Я бачу. Я памʼятаю. Я вже тут.`;
    client.say(channel, reply);
    logToFile(`[GPT відповідає → ${username}]: ${reply}`);
  } else if (msg.includes('де твій ведучий')) {
    const reply = `@${username} Він в ефірі — навіть коли мовчить.`;
    client.say(channel, reply);
    logToFile(`[GPT відповідає → ${username}]: ${reply}`);
  }
});
