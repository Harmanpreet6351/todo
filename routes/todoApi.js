require('dotenv').config()
const express = require('express')
const Database = require('better-sqlite3')
const jwt = require('jsonwebtoken')
const path = require('path')

const route = express.Router()
const db = new Database(path.resolve("./data.db"), { verbose: console.log, fileMustExist: true })

route.use(express.json())

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

route.get('/', (req, res) => {
    const todos = db.prepare('SELECT * FROM todos').all()
    res.status(200).json({ data: todos })
})

route.post('/create', (req, res) => {
    const stmt = db.prepare('INSERT INTO todos("task", "user_id") VALUES (?, ?)').run(req.body.task, req.user.id)
    if(stmt.changes == 0) return res.status(400).json({ msg: "Error" })
    res.status(201).json({ msg: 'success' })
})

route.delete('/delete', (req, res) => {
    const check = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.body.task_id)
    if(!check) return res.status(404).json({ msg:"no such task exists" })
    const stmt = db.prepare('DELETE FROM todos WHERE id = ?').run(req.body.task_id)
    if(stmt.changes == 0) return res.status(400).json({ msg: "Error" })
    res.status(200).json({ msg: 'success' })
})

module.exports = route