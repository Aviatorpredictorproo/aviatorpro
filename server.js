const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 10000;

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true
}));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'Aviatorpro2025' && password === 'aviator@admin') {
    req.session.loggedIn = true;
    res.redirect('/index');
  } else {
    res.send('Invalid login. <a href="/">Try again</a>');
  }
});

app.get('/index', (req, res) => {
  if (req.session.loggedIn) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
