const { Router } = require('express');
const User = require('../../models/User');

const router = Router();

/**
 * @route   GET api/users
 * @desc    Get all users
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find();

    if (!users) {
      throw Error('No users exist');
    }

    res.json(users);
  } catch (e) {
    res.status(400).json({ msg: e.message });
  }
});

module.exports = router;
