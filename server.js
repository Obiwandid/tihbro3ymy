const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

// Запускає shadow.js і events.js
try {
  require('./shadow.js');
} catch (err) {
  console.error('❌ shadow.js error:', err);
}
try {
  require('./events.js');
} catch (err) {
  console.error('❌ events.js error:', err);
}

app.get('/', (req, res) => {
  res.send('<h1>TIHbPO3YMY активна. Тінь не спить.</h1>');
});

app.listen(port, () => {
  console.log(`🌐 Вебсервер активний на порту ${port}`);
});