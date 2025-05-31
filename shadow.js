
const tmi = require('tmi.js');
const { askGPT } = require('./brain');

const knownViewers = {};
const honoredSubs = new Set();

const client = new tmi.Client({
  identity: {
    username: 'TIHPO3YMY',
    password: 'oauth:aruasm859j43j7wgc8qp1f6bqp2c8j'
  },
  channels: ['borodatiyky']
});

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

  // 💖 Подяка за сабку (один раз)
  if (isSub && !honoredSubs.has(username)) {
    honoredSubs.add(username);
    client.say(channel, `@${username} 🖤 Сабка від тебе — це не просто підтримка. Це знак. Тінь бачить ветеранів. І не забуває.`);
    return;
  }

  // 💀 Якщо глядач "душить", але не фоловер
  const toxicTriggers = ['ти дебіл', 'шо за хрінь', 'шо ти мелеш', 'душить'];
  if (!isFollower && toxicTriggers.some(tr => msgLower.includes(tr))) {
    client.say(channel, `@${username} 👁 Нефоловери, які душать — це найкраще добриво для сарказму. Тебе вже поливають.`);
    return;
  }

  // 🤖 Запамʼятати глядача
  if (!knownViewers[username]) {
    knownViewers[username] = { count: 1, last: message };
  } else {
    knownViewers[username].count++;
    knownViewers[username].last = message;
  }

  // GPT-відповіді на тригери
  const triggerPhrases = ['де знижки', 'привіт', 'hello', 'де твій ведучий', 'ти тут?', 'тінь'];
  if (triggerPhrases.some(p => msgLower.includes(p))) {
    const reply = await askGPT(message, username);
    if (reply) {
      client.say(channel, `@${username} ${reply}`);
    }
  }
});
