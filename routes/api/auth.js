const { Router } = require('express');
const bcrypt = require('bcryptjs');
// const config = require('../../config');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');
// User Model
const User = require('../../models/User');

// const { JWT_SECRET } = config;
const JWT_SECRET = 'bd8a9806-8ea2-4409-b601-5d7e7a66273c';
const router = Router();

/**
 * @route   POST api/auth/login
 * @desc    Login user
 * @access  Public
 */

router.post('/login', async (req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*');

  const { email, password } = req.body;
  // Simple validation
  if (!email || !password) {
    // return res.status(400).json({ msg: 'Please enter all fields' });
    throw Error('Insira todos os campos.');
  }

  // try {
  // Check for existing user
  const user = await User.findOne({ email });
  if (!user) throw Error('Usuário não existe.');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw Error('Senha inválida.');

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: 3600 });
  if (!token) throw Error('Erro na geração do token.');

  // res.cookie('token', token, {
  //   expires: new Date(Date.now() + 1615165200),
  //   httpOnly: true,
  //   secure: false,
  // });

  res.status(201).json({ token });
  // res.status(201).json({});
  // next();
  // nex;
  // res.status(200).json({
  //   token,
  //   user: {
  //     id: user._id,
  //     name: user.name,
  //     email: user.email,
  //   },
  // });
  // } catch (e) {
  //   throw({ msg: e.message });
  // }
});

/**
 * @route   POST api/users
 * @desc    Register new user
 * @access  Public
 */

router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Simple validation
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  // try {
  const user = await User.findOne({ email });
  if (user) throw Error('User already exists');

  const salt = await bcrypt.genSalt(10);
  if (!salt) throw Error('Something went wrong with bcrypt');

  const hash = await bcrypt.hash(password, salt);
  if (!hash) throw Error('Something went wrong hashing the password');

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hash,
  });

  const savedUser = await newUser.save();
  if (!savedUser) throw Error('Something went wrong saving the user');

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
  // } catch (e) {
  //   res.status(400).json({ error: e.message });
  // }
});

/**
 * @route   GET api/auth/user
 * @desc    Get user data
 * @access  Private
 */

router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) throw Error('User does not exist');
    res.json(user);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
