const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User')

const router = express.Router();

//Account Register
router.post('/register', async (req, res) => {

    const { email, password } = req.body;

    try {

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully'
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        })

    }

});


//User Login
router.post('/login', async (req, res) => {

    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'You have invalid credentials'
            });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(400).json({
                message: 'You have invalid credentials'
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.json({
            token,
            user: {
              id: user._id,
              email: user.email,
              role: user.role,
            },
          });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

})

// Admin Register
router.post("/register-admin", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const user = new User({
        email,
        password: hashedPassword,
        role: "admin",
      });
  
      await user.save();
  
      res.status(201).json({
        message: "Admin registered successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  });
module.exports = router;
