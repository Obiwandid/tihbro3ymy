const express = require('express');
const app = express();
const port = 8000;

app.get('/', (req, res) => {
  const { code, state } = req.query;
  res.send(`Twitch OAuth Code: ${code}<br>State: ${state}`);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
