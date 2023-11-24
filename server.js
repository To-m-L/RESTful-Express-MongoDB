const express = require("express")
const app = express()
const mongoose = require("mongoose")

//Connect to Databases
const notesDB = mongoose.createConnection('mongodb://localhost/notes')
notesDB.once('open', () => console.log("Connected to Notes Database"))
const userDB = mongoose.createConnection('mongodb://localhost/users')
userDB.once('open', () => console.log("Connected to User Database"))

//Note Schema
const noteSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true
    },
    owner:{
        type: String,
        required: true

    },
    sharedWith:{
        type: [String],
        default: []
    }
    

})
const Note = notesDB.model('Note', noteSchema)

//User Schema
const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true

    },
    password:{
        type: String,
        required: true

    }
})
const User = userDB.model('User', userSchema)


app.use(express.json())

const notesRouter = require('./routes/notes')(Note);
app.use("/notes", notesRouter)
const authRouter = require("./routes/auth")(User);
app.use("/auth", authRouter)


app.listen(3000, () => console.log("Server Started."))