require('dotenv').config

const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')

module.exports = (Note) =>{

    //GET all of user's notes

    router.get("/", authenticateToken, async(req, res)=>{
        
        try{
            const notes = await Note.find({
                $or: [
                    { "owner": req.user.name }, // Notes owned by the user
                    { "sharedWith": { $in: [req.user.name] } } // Notes shared with the user
                ]
            });
            res.json(notes)
        }catch(err){
            res.status(500).json({message: err.message})
        }

    })

    //GET search for note based on keyword

    router.get("/search", authenticateToken, async (req, res) => {
        const keyword = req.query.keyword;
        try {
            const notes = await Note.find({ "owner": req.user.name, "content": { $regex: keyword, $options: 'i' } });
            res.json(notes);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
   }); 

    //GET one of user's notes based on id

    router.get("/:id", authenticateToken, async(req, res)=>{

        try{
            const note = await Note.find({"owner": req.user.name, "_id": req.params.id})
            res.json(note)
        }catch(err){
            res.status(500).json({message: err.message})
        }

    })


    //POST creating a new note

    router.post("/", authenticateToken, async(req, res) =>{

        const note = new Note({
            content: req.body.content,
            owner: req.user.name
        })
        try{
            const newNote = await note.save()
            res.json(newNote)
        }
        catch(err){
            res.status(500).json(err)
        }

    })

    //PUT updating an existing note

    router.put("/:id", authenticateToken, async (req, res) => {
        try {
            const updatedNote = await Note.findOneAndUpdate(
                { "_id": req.params.id, "owner": req.user.name },
                { $set: { content: req.body.content } },
                { new: true }
            );
            if (!updatedNote) {
                return res.status(404).send("Note not found or unauthorized");
            }
            res.json(updatedNote);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    //DELETE an existing note

    router.delete("/:id", authenticateToken, async (req, res) => {
        try {
            const deletedNote = await Note.findOneAndDelete({ "_id": req.params.id, "owner": req.user.name });
            if (!deletedNote) {
                return res.status(404).send("Note not found or unauthorized");
            }
            res.json({ message: "Note deleted" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });

    //POST sharing a note with another user

    router.post("/:id/share", authenticateToken, async (req, res) => {
        try {
            const noteId = req.params.id;
            const sharedUser = req.body.sharedUser; // Assuming you send the username or ID of the user to share with in the request body
    
            // Fetch the note by ID and ensure the requester is the owner
            const note = await Note.findOne({ _id: noteId, owner: req.user.name });
    
            if (!note) {
                return res.status(404).send("Note not found or unauthorized");
            }
    
            // Check if the note is already shared with the user
            if (note.sharedWith.includes(sharedUser)) {
                return res.status(400).send("Note already shared with this user");
            }
    
            // Add the user to the sharedWith array and save the note
            note.sharedWith.push(sharedUser);
            await note.save();
    
            res.json({ message: `Note shared with ${sharedUser} successfully` });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    });
    
    // authentication middleware
    function authenticateToken(req, res, next){
        const authHeader = req.headers["authorization"]
        const token = authHeader && authHeader.split(" ")[1]
        if(token==null) return res.status(401).send("No token")
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) =>{
            if (err) return res.sendStatus(403)
            req.user = user
            next()
            
        })
    }

    return router
}





