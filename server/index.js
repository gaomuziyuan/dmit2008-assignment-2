const fs = require('fs');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
let users = require('./data/users.json');
let dataArray = [];
PORT = 3000;


app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client'), {
    dotfiles: 'ignore',
    extensions: ['html', 'htm']
}));

const { body, validationResult } = require('express-validator');

app.post('/signup',
    body('fullname').isLength({ min: 6 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        fs.readFile(path.join(__dirname, './data/users.json'), function (err, data) {
            dataArray = JSON.parse(data.toString());
            console.log(req.body)
            req.body.id = uuidv4();
            dataArray.push(req.body);
            fs.writeFile(path.join(__dirname, './data/users.json'), JSON.stringify(dataArray), function (err) {
                if (err) {
                    console.log(err);
                    res.sendFile(path.join(__dirname, '../client/404.html'));
                }
                res.sendFile(path.join(__dirname, '../client/login.html'));
            });
        });
    });




let session = require('express-session');
app.use(session({
    secret: 'dashboardAuth',
    name: 'session_id',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5000 },
    rolling: true
}));

app.post('/login',
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.session.email = req.body.email;
        res.session.password = req.body.password;
        // res.redirect(path.join(__dirname, '../client/views/dashboard'));
        res.redirect('/dashboard')
    });

app.get('/login', (req, res) => {
    res.session.email = req.body.email;
    res.session.password = req.body.password;
    if (req.session.email && req.session.password) {
        res.send("Welcome back!");
    }
    else { res.send("Failed to login"); }
})

app.get('/api/v1/users', (req, res) => {
    res.json(users);
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../client/404.html'));
})

app.listen(PORT, () => {
    console.log(`Server starts at http://localhost:${PORT}`);
})