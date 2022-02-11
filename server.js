const express = require('express')
const app = express()
const authApi = require('./routes/authApi')

app.use('/auth', authApi)

app.listen(3000)