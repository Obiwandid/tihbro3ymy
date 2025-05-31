
const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 8000;

// 🌐 Тримай порт активним
app.get('/', (req, res) => {
  res.send('🖤 TIHbPO3YMY активна 24/7. Слідкую за чатом і подіями.');
});

app.listen(port, () => {
  console.log(`🌐 Вебсервер активний на порту ${port}`);
});

// 🧠 Запускаємо чат-бота (shadow.js)
const shadow = spawn('node', ['shadow.js']);
shadow.stdout.on('data', (data) => console.log(`💬 shadow.js: ${data}`));
shadow.stderr.on('data', (data) => console.error(`❌ shadow.js error: ${data}`));

// 📡 Запускаємо EventSub-подійник (events.js)
const events = spawn('node', ['events.js']);
events.stdout.on('data', (data) => console.log(`📡 events.js: ${data}`));
events.stderr.on('data', (data) => console.error(`❌ events.js error: ${data}`));
