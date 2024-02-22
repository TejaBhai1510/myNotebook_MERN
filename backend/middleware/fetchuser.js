const jwt = require('jsonwebtoken');
const JWT_SECRET = "TejaBhai";

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.ststus(401).send({ error: "Please Authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        res.ststus(401).send({ error: "Please Authenticate using a valid token" });
    }
}

module.exports = fetchuser