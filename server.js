const express = require('express')
const app = express()
const userRouter = require('./routes/user')

app.use('/', userRouter)

app.listen(3000)