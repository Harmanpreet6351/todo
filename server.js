const express = require('express')
const app = express()
const authApi = require('./routes/authApi')
const todoApi = require('./routes/todoApi')
const helmet = require('helmet')

app.use(helmet())

app.use('/auth', authApi)

app.use('/todos', todoApi)

app.listen(3000)