require('dotenv').config()
const express = require('express')
// const session = require('express-session')
const massive = require('massive')
const path = require('path')
const cors = require('cors')

const {SERVER_PORT, SESSION_SECRET, CONNECTION_STRING} = process.env

const port = process.env.PORT || SERVER_PORT

const app = express()

const ctrl = require('./controller')

app.use(express.json())
app.use(cors())


app.listen(port, () => {console.log(`Server connected on port ${port}`)})

app.get('/seed', ctrl.seed)
app.get('/getAllUsers', ctrl.getAllUsers)
app.get('/getOneUser/:user_id', ctrl.getOneUser)
app.post('/addUser', ctrl.addUser)
app.put('/editUser/:user_id', ctrl.editUser)
app.delete('/deleteUser/:user_id', ctrl.deleteUser)