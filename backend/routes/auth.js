const express = require('express');
const User = require('../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "TejaBhai";

// ROUTE 1: Create a user using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
    body('name', 'Enter a valid Name').isLength({ length: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 charecters').isLength({ length: 5 })

], async (req, res) => {
    // If there are errors, return Bad request along with the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        // Check whether a user exists with the email already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: "Sorry a user with this email already exists!" });
        }
        // Securing Password with Salt
        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);
        // Create a new user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
        })
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". 
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Try logging with correct Credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ error: "Try logging with correct Credentials" });
        }
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ authToken });
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error: Some Error occured")
    }
})

// ROUTE 3: Get User Details using: POST "/api/auth/getuser", Login Required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error: Some Error occured")
    }
})

module.exports = router