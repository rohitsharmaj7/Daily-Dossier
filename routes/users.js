const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');

require('../models/User');
const User = mongoose.model('users');

//User login Route
router.get('/login',(req,res)=>{
    res.render('users/login');
});

//Login pOST REQUEST
router.post('/login',(req,res, next)=>{
    passport.authenticate('local',{
        successRedirect : '/dossiers',
        failureRedirect: '/users/login',
        failureFlash : true
    })(req,res,next);
});

//Users Register Route
router.get('/register',(req,res)=>{
    res.render('users/register');
});



//Register Post routes
router.post('/register',(req,res)=>{
    let errors = [];
    if(req.body.password!=req.body.password2)
    {
        errors.push({text: 'Password do not match'});
    }
    if(req.body.password.length< 4)
    {
        errors.push({text: 'Passwod length should be more than 4 characters'});
    }

    if(errors.length>0)
    {
        res.render('users/register' ,{
            errors: errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2 : req.body.password2
        });
    }
    else
    {
        User.findOne({email: req.body.email})
        .then(user=>{
            if(user)
            {
                req.flash('error_msg', 'Email already registered');
                res.redirect('/users/register');
            }
            else
            {
                const newUser = new User({
                    name: req.body.name,
                    email:req.body.email,
                    password:req.body.password
                });
        
                bcrypt.genSalt(10, function(err, salt) {     //encrypt the password with some hash values
                    bcrypt.hash(newUser.password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        newUser.password = hash;
                        newUser.save()
                        .then(users => {
                            
                            req.flash('success_msg', 'You are registerd and can login now');
                            res.redirect('/users/login');
                        });
                    });
                });
            }
        })


    }
});


//Loout Route
router.get('/logout', (req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports = router;
