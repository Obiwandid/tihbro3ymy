const express = require('express');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const port = 8000;

console.log('🧩 events.js активовано (але ще не налаштовано)');
require('./events.js');

// Запуск shadow.js
const botProcess = spawn('node', [path.join(__dirname, 'shadow.js')], {
  stdio: 'inherit',
});

app.get('/', (req, res) => {
  res.send('🌐 Вебсервер активний на порту ' + port);
});

app.listen(port, () => {
  console.log(`🌐 Вебсервер активний на порту ${port}`);
});