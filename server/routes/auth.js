const express = require('express');
const router = express.Router();
const bycrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }

        let user = await User.findOne({ username: username });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
        username: username,
        password: password
    });

    const salt = await bycrypt.genSalt(10);
    user.password = await bycrypt.hash(password, salt);

    await user.save();

    const payload = {
        user: {
            id: user.id
        }
    };  

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 3600 },
        (err, token) => {
            if (err) throw err;
            res.status(201).json({ token: token });
        }
    );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ msg: 'Please enter all fields' });
        }
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await bycrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token: token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;