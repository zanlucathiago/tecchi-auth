const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

const JWT_SECRET = process.env.JWT_SECRET;
const router = Router();

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Error('Insira todos os campos.');
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw Error('Usuário não existe.');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw Error('Senha inválida.');
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });

    if (!token) {
      throw Error('Erro na geração do token.');
    }

    res.status(201).json({ token });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   POST api/users
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const user = await User.findOne({ email });

    if (user) {
      throw Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);

    if (!salt) {
      throw Error('Something went wrong with bcrypt');
    }

    const hash = await bcrypt.hash(password, salt);

    if (!hash) {
      throw Error('Something went wrong hashing the password');
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hash,
    });

    const savedUser = await newUser.save();

    if (!savedUser) {
      throw Error('Something went wrong saving the user');
    }

    const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, {
      expiresIn: 3600,
    });

    res.status(200).json({
      token,
      user: {
        id: savedUser.id,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
      },
    });
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      throw Error('User does not exist');
    }

    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
