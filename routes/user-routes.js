const express = require('express');

const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersController.getUsers);
router.post('/signup', usersController.signup);
router.post('/login', usersController.login);
router.get('/:uid', usersController.getUserById);
router.delete('/:uid', usersController.deleteUser);


module.exports = router;