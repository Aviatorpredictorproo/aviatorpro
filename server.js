const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'super-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 60 * 1000,
        secure: false,
        sameSite: 'lax'
    }
}));

// Serve only public static files
app.use(express.static(path.join(__dirname, 'public')));

// Authentication middleware
function checkAuth(req, res, next) {
    if (req.session.loggedIn) return next();
    return res.redirect('/');
}

// Login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Handle login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'Megatech' && password === 'admin@mega') {
        req.session.loggedIn = true;
        return res.redirect('/dashboard');
    }

    res.send(`
        <h1 style="color:red; text-align:center;">❌ Invalid login or password</h1>
        <script>setTimeout(() => { window.location.href = '/'; }, 2000);</script>
    `);
});

// Protected route
app.get('/dashboard', checkAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'private', 'index.html'));
});

// Block direct access to index.html in public
app.get('/index.html', (req, res) => {
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
