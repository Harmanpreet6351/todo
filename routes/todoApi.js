require('dotenv').config()
const express = require('express')
const Database = require('better-sqlite3')
const jwt = require('jsonwebtoken')
const path = require('path')

const route = express.Router()
const db = new Database(path.resolve("./data.db"), { verbose: console.log, fileMustExist: true })

route.use(function(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.SECRET_KEY || 'secret-key', (err, decoded) =>{
        if(err) {
            console.log(err)
            return res.sendStatus(403)
        }
        console.log(decoded)
        const user = db.prepare('SELECT * FROM users WHERE username = ?').get(decoded['username'])
        if(!user) return res.sendStatus(403)
        req.user = user
        next()
    })
})

module.exports = route