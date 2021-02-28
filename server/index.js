// require dotenv package to read the properties in the .env file.
require('dotenv').config();
const fs = require('fs');

//import the express module
const express = require('express');
const app = express();

// import the path utils from Node.
const cors = require('cors');
const path = require('path');

// read the value of PORT NODE_EVN variable in the .env file
const PORT = process.env.PORT || 5000;

// import session
const session = require('express-session');
// const cookieSession = require('cookie-session');

// Middleware for session
app.use(session({
    secret: 'dashboardAuth',
    name: 'session_id',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5000 },
    rolling: true
}));
// app.use(cookieSession(
//     {
//         name: "session",
//         keys: ['gwoghwo', 'sgjwohge']
//     }
// ));

// Middleware for corss origin resource sharing
app.use(cors());

//To get access to the name value pairs sent in the body message of POST Request.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware Serving Static Pages from client directory, 
// and the second parameter is an configuration object of 
// how we want the static file server to run.
app.use(express.static(path.join(__dirname, '../client'), {
    dotfiles: 'ignore',
    extensions: ['html', 'htm']
}));

// Setup template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

// Render dashboard and login page
app.get('/dashboard', (req, res) => {
    if (req.session.isValid) {
        res.render('dashboard');
    }
    else { res.redirect('/login'); }
})

app.get('/signup', (req, res) => {
    res.render('signup', { nameWarning: "must be at least 6 characters", emailWarning: "email@workspace.com", passwordWarning: "must be at least 8 characters", name: "Colin Gao", email: "mgao7@nait.ca", password: "12345678" });
});

app.get('/login', (req, res) => {
    res.render('login', { emailWarning: "email@workspace.com", passwordWarning: "must be at least 8 characters", email: "email@workspace.com", password: "temporary" });
});

// import express-validator
const { body, validationResult } = require('express-validator');

// import uuid
const { v4: uuidv4 } = require('uuid');

app.post('/signup',
    body('fullname').isLength({ min: 6 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }), (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const credentials = {
            fullname: req.body.fullname,
            email: req.body.email,
            password: req.body.password
        };
        fs.readFile(path.join(__dirname, './data/users.json'), function (err, data) {
            if (err) {
                throw err;
            }
            dataArray = JSON.parse(data);
            credentials.id = uuidv4();
            dataArray.push(credentials);
            fs.writeFile(path.join(__dirname, './data/users.json'), JSON.stringify(dataArray), function (err) {
                if (err) {
                    throw err;
                }
                res.redirect('/login');
            });
        });
    });


// import loginService
const loginService = require('./services/loginService');
app.post('/login', (req, res) => {
    const credentials = {
        email: req.body.email,
        password: req.body.password
    };

    const authUser = loginService.authenticate(credentials).user;
    if (authUser !== null) {
        if (!req.session.isValid) {
            req.session.isValid = true;
        }
        res.redirect('/dashboard');
    }
});
// app.post('/login',
//     body('email').isEmail(),
//     body('password').isLength({ min: 8 }),
//     (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         fs.readFile(path.join(__dirname, './data/users.json'), function (err, data) {
//             if (err) {
//                 console.log(err);
//             }
//             dataArray = JSON.parse(data.toString());
//             fs.writeFile(path.join(__dirname, './data/users.json'), JSON.stringify(dataArray), function (err) {
//                 if (err) {
//                     console.log(err);
//                     res.sendFile(path.join(__dirname, '../client/404.html'));
//                 }
//                 res.redirect('views/login');
//             });
//         });
//         const credentials = {
//             email: req.body.email,
//             password: req.body.password
//         };
//         req.session.email = req.body.email;
//         req.session.password = req.body.password;
//         res.redirect('/dashboard');
//     });


let bonusUsers = require('./data/users.json');
app.get('/api/v1/users', (req, res) => {
    res.json(bonusUsers);
})

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../client/404.html'));
})

app.listen(PORT, () => {
    console.log(`Server starts at http://localhost:${PORT}`);
})