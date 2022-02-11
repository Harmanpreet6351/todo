const express = require("express")

const route = express.Router()

route.use(express.json())

route.post('/register', (req, res) => {})

route.post('/login', (req, res) => {})


module.exports = route