const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.headers.cookie
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, 'hello'); //process.env.
        req.user = decoded.user
        next();
    } catch (err) {
        console.error(err)
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = auth;