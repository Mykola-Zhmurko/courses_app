const { body } = require('express-validator');
const User = require('../models/user');

exports.registerValidators = [
    body('email').isEmail().withMessage('Enter a valid email')
    .custom(async (value, { req }) => {
        try{
            const user = await User.findOne({ email: value })
            if(user){
                return Promise.reject('This email is already in use')
            }
        }catch(e){
            console.log(e)
        }   
    })
    .normalizeEmail(),
    body('password', 'The password must be min 6 symbols')
    .isLength({ min: 6, max: 56 }).isAlphanumeric()
    .trim(),
    body('confirm').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('The password is not the same');
        }
        return true;
    }).trim()
];


exports.courseValidators = [
    body('title').isLength({min: 3}).withMessage('Enter min 3 symbols').trim(),
    body('price').isNumeric().isLength({min: 1}).withMessage('Enter the real price'),
    body('img', 'Enter the correct URL of img')
]