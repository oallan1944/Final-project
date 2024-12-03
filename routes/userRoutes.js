//supporting packages and modules
const express = require('express');
const {registerUser, loginUser, getUser, editUser } = require('..controllers/userControllers');
const {check} = require('express-validator'); //validation in the back end
const { logoutUser } = require('../controllers/userController');
const router = express.Router(); //help in directing requests

//register route
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please provide a valid email').isEmail(),
        check('password', 'password must be 6 characters or more').isLength({min:6})
    ],
    registerUser
);
//login route
router.post('/login', loginUser);
//get user
router.get('/individual', getUser);
//edit user
router.put(
    '/individual/edit',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'please enter a valid email').isEmail(),
        check('password', 'password must be 6 charcters or more').isLength({ min:6})
    ],
    editUser
);

//logout
router.get('/logout', logoutUser);
module.exports = router;
