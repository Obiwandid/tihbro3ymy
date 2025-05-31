const tmi = require('tmi.js');
const fs = require('fs');
const { askGPT } = require('./brain');

const VIEWERS_FILE = 'viewers.json';
let viewers = {};

if (fs.existsSync(VIEWERS_FILE)) {
  try {
    viewers = JSON.parse(fs.readFileSync(VIEWERS_FILE));
  } catch (e) {
    console.error('❌ Не вдалося прочитати viewers.json:', e);
  }
}

const client = new tmi.Client({
  identity: {
    username: 'TIHPO3YMY',
    password: 'oauth:aruasm859j43j7wgc8qp1f6bqp2c8j'
  },
  channels: ['borodatiyky']
});

const honoredSubs = new Set();

client.connect().then(() => {
  console.log('🟢 Підключено до Twitch-чату як TIHPO3YMY → irc-ws.chat.twitch.tv:443');
}).catch((err) => {
  console.error('❌ Помилка підключення до чату:', err);
});

client.on('message', async (channel, tags, message, self) => {
  if (self || tags.username === 'streamelements') return;

  const username = tags['display-name'] || tags.username;
  const badges = tags['badges'] || {};
  const isFollower = badges['subscriber'] || badges['vip'] || badges['moderator'];
  const isSub = badges['subscriber'];
  const msgLower = message.toLowerCase();

  console.log(`💬 [${username}]: ${message}`);

  if (!viewers[username]) {
    viewers[username] = {
      messages: [],
      count: 0,
      isSub: isSub || false,
      isVIP: badges['vip'] || false,
      isMod: badges['moderator'] || false,
      lastSeen: new Date().toISOString()
    };
  }
  viewers[username].count++;
  viewers[username].lastSeen = new Date().toISOString();
  viewers[username].messages.push(message);
  if (isSub) viewers[username].isSub = true;

  fs.writeFileSync(VIEWERS_FILE, JSON.stringify(viewers, null, 2));

  if (isSub && !honoredSubs.has(username)) {
    honoredSubs.add(username);
    client.say(channel, `@${username} 🖤 Сабка — це обітниця. Я її чула.`);
    return;
  }

  const toxicTriggers = ['ти дебіл', 'шо за хрінь', 'шо ти мелеш', 'душить', 'ідіот'];
  if (!isFollower && toxicTriggers.some(tr => msgLower.includes(tr))) {
    client.say(channel, `@${username} 👁 Ти не фоловиш. Але вже душиш? Вдихай.`);
    return;
  }

  const triggerPhrases = ['де знижки', 'привіт', 'hello', 'де твій ведучий', 'ти тут?', 'тінь'];
  if (triggerPhrases.some(p => msgLower.includes(p))) {
    const reply = await askGPT(message, username);
    if (reply) {
      client.say(channel, `@${username} ${reply}`);
    }
  }
});