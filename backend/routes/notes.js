const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');

// ROUTE 1: Get all notes using: GET "/api/auth/fetchallnotes", Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

// ROUTE 2: Add notes using: POST "/api/auth/addnote", Login Required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ length: 3 }),
    body('description', 'Description must be atleast 5 charecters').isLength({ length: 5 })
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // If there are errors, return Bad request along with the errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({ title, description, tag, user: req.user.id });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

module.exports = router