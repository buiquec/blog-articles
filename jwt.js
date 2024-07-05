const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    const payload = { user }
    return jwt.sign(payload, 'hello', { expiresIn: '1h' })
};

module.exports = { generateToken };