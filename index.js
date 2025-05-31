const express = require('express');
const app = express();
const port = process.env.PORT || 8000;

app.get('/', (req, res) => {
  const { code, state } = req.query;

  if (code) {
    res.send(`
      <h2>✅ Twitch OAuth успішно</h2>
      <p><strong>Code:</strong> ${code}</p>
      <p><strong>State:</strong> ${state || '—'}</p>
    `);
  } else {
    res.send(`
      <h2>❌ Код не отримано</h2>
      <p>Перевір, що ти заходив через правильне посилання з авторизацією Twitch.</p>
    `);
  }
});

app.listen(port, () => {
  console.log(`🚀 Сервер працює на порту ${port}`);
});
