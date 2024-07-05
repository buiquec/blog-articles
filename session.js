const session = require('express-session');
const cookieParser = require('cookie-parser');

const sessionConfig = session({
    secret: "hello", 
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 , secure: 'auto' } // Set secure to 'true' in production
});

module.exports = {
    session: sessionConfig,
    cookieParser
};