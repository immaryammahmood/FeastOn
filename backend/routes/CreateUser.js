const express = require('express');
const user = require('../models/User.js');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const router = express.Router();

router.post("/createuser", [
    body('email').isEmail(),
    body('name').isLength({ min: 10 }),
    body('password', 'Incorrect Password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const salt = await bcrypt.genSalt(10);
    let secPassword = await bcrypt.hash(req.body.password, salt);
    try {
        await user.create({
            name: req.body.name,
            email: req.body.email,
            password: secPassword,
            location: req.body.location
        });
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

router.post("/loginuser", [
    body('email').isEmail(),
    body('password', 'Incorrect Password').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    let email = req.body.email;
    try {
        let userData = await user.findOne({ email });
        if (!userData) {
            return res.status(400).json({ errors: "Invalid Credentials" });
        }
        const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
        if (!pwdCompare) {
            return res.status(400).json({ errors: "Invalid Credentials" });
        }
        const data = {
            user: {
                id: userData.id
            }
        };
        const authToken = jwt.sign(data, process.env.jwt_secret);
        return res.json({ success: true, authToken: authToken });
    } catch (error) {
        console.log(error);
        res.json({ success: false });
    }
});

module.exports =  router;
