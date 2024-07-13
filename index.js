const express = require('express');
const mongoose = require('mongoose');
const User = require('./model/schema');
const MongoStore = require('connect-mongo');
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/auth' }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 }  // here cookie will expire 1 day
}));

// Set view engine to EJS
app.set('view engine', 'ejs');
// Specify the views directory
app.set('views', path.join(__dirname, 'views'));
// Serve static files from the "public" directory
app.use(express.static('public'));

// MongoDB connection URI
const MONGO_URI = 'mongodb://localhost:27017/auth';

// Asynchronous function to Connection with MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Successfully Connected to MongoDB!');
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

// Call the asynchronous function to establish the connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.render('home', { user: req.session.user, message: req.session.message });
    delete req.session.message;
});

app.get('/login', (req, res) => {
    res.render('login', { error: req.session.error });
    delete req.session.error;
});

app.get('/register', (req, res) => {
    res.render('register', { error: req.session.error });
    delete req.session.error;
});

app.get('/dashboard', (req, res) => {
    if (req.session.user) {
        res.render('dashboard', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// POST route for user Registration
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.session.error = 'Username already exists';
            return res.redirect('/register');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        req.session.user = { id: user._id, username: user.username };
        req.session.message = { type: 'success', text: "Successfully Registered!" };
        res.redirect('/login');
    }
    catch (error) {
        console.error('Registration error:', error);
        req.session.error = 'An error occurred during registration';
        res.redirect('/register');
    }
});

// POST route for user Login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = { id: user._id, username: user.username };
            req.session.message = { type: 'success', text: "Successfully Logged In!" };
            res.redirect('/dashboard');
        }
        else {
            req.session.error = 'Invalid username or password';
            res.redirect('/login');
        }
    }
    catch (error) {
        console.error('Login error:', error);
        req.session.error = 'An error occurred during login';
        res.redirect('/login');
    }
});

// GET route for user Logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// My Server
app.listen(PORT, () => {
    console.log(`Server running at:- http://localhost:${PORT}`);
});
 
