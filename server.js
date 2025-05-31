const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const code = req.query.code;
  if (code) {
    res.send(`Authorization Code: ${code}`);
  } else {
    res.send('No code received');
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
