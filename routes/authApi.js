require('dotenv').config()
const express = require("express")
const Database = require('better-sqlite3')
const bycrpt = require("bcryptjs")
const path = require("path")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const db = new Database(path.resolve("./data.db"), { verbose: console.log, fileMustExist: true })

const route = express.Router()

route.use(express.json())

const registerValidators = [
    body('username').custom(value => {
        const user = db.prepare('SELECT * FROM "users" WHERE username = ?').get(value)
        if (user) throw Error("Username already exists")
        return true
    }).notEmpty().withMessage("Username Required"),
    body('email').notEmpty().withMessage("Email Required").bail().isEmail().withMessage("Invalid Email ID").custom(value => {
        const user = db.prepare('SELECT * FROM "users" WHERE email = ?').get(value)
        if (user) throw Error("Email already exists")
        return true
    }),
    body('passwd').notEmpty().withMessage('Password Required').bail().isLength({ min: 8 }).withMessage('Atleast 8 characters'),
]

const loginValidators = [
    body('email').notEmpty().withMessage("Email Required").bail().isEmail().withMessage("Invalid Email ID"),
    body('passwd').notEmpty().withMessage('Password Required').bail().isLength({ min: 8 }).withMessage('Atleast 8 characters'),
]

route.post('/register', registerValidators,async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ err: errors.array() })
        }
        const salt = await bycrpt.genSalt(10)
        const passwd = await bycrpt.hash(req.body.passwd, salt)
        db.prepare('INSERT INTO "users"(username, email, passwd) VALUES (?, ?, ?)').run(req.body.username, req.body.email, passwd)
        res.status(201).json({ msg: "Thank you for Signing up!" })
    }
)

route.post('/login', loginValidators,async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({ err: errors.array() })
        const user = db.prepare('SELECT * FROM users WHERE email = ?').get(req.body.email)
        if (!user) return res.status(401).json({ err: "Invalid username or password" })
        const isUserValid = await bycrpt.compare(req.body.passwd, user.passwd)
        res.status(200).json({
            token: jwt.sign({ username: user.username },
                process.env.SECRET_KEY || "secret-key",
                { expiresIn: "3600s" })
        })
    })


module.exports = route