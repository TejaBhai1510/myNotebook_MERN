const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');

// ROUTE 1: Get all notes using: GET "/api/notes/fetchallnotes", Login Required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id })
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

// ROUTE 2: Add notes using: POST "/api/notes/addnote", Login Required
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

// ROUTE 3: Updating an existing Note using: PUT "/api/notes/updatenote", Login Required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        // Create a new note Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        // Find the note to be Updated & Update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Authorized"); }

        note = await Note.findOneAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

// ROUTE 4: Deleting an existing Note using: DELETE "/api/notes/deletenote", Login Required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        // Find the note to be Updated & Update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found"); }
        if (note.user.toString() !== req.user.id) { return res.status(401).send("Not Authorized"); }

        note = await Note.findOneAndDelete(req.params.id);
        res.send({"Success": "Note has been deleted"});
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
})

module.exports = router