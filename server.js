const express = require('express')
const app = express()
const authApi = require('./routes/authApi')
const todoApi = require('./routes/todoApi')

app.use('/auth', authApi)

app.use('/todos', todoApi)

app.listen(3000)