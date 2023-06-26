const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const { email, firstName, lastName } = req.body;
    console.log(email);
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user details
    user.firstName = firstName;
    user.lastName = lastName;

    // Save the updated user
    await user.save();

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
});

module.exports = router;
