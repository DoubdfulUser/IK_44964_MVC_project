const User = require('../models/user');
const bcrypt = require('bcrypt');

exports.registerUser = async (req, res) => {
    try {
        const { username, email, password, password2, first_name, last_name } = req.body;

        if (password !== password2) {
            return res.status(400).send('Passwords do not match');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username, 
            email, 
            password: hashedPassword, 
            first_name, 
            last_name 
        });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            req.session.userId = user._id;
            req.session.user = user;
            console.log('User logged in:', req.session.user); // Добавлено логирование
            res.redirect('/trainings');
        } else {
            res.status(400).send('Invalid credentials');
        }
    } catch (error) {
        res.status(400).send(error);
    }
};

exports.logoutUser = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send(err);
        }
        res.redirect('/login');
    });
};
