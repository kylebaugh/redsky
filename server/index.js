require('dotenv').config()
const express = require('express')
// const session = require('express-session')
const path = require('path')
const cors = require('cors')

// const {SERVER_PORT} = process.env
const {PORT} = process.env.PORT

// const PORT = process.env.PORT || SERVER_PORT

const app = express()

const ctrl = require('./controller')

app.use(express.json())
app.use(cors())

app.use(express.static(path.resolve(__dirname, "../build")));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {console.log(`Server connected on port ${PORT}`)})

app.get('/seed', ctrl.seed)
app.get('/getAllUsers', ctrl.getAllUsers)
app.get('/getOneUser/:user_id', ctrl.getOneUser)
app.post('/addUser', ctrl.addUser)
app.put('/editUser/:user_id', ctrl.editUser)
app.delete('/deleteUser/:user_id', ctrl.deleteUser)