const express= require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {ensureAuthenticated} = require('../helpers/auth');

//Load Dossier Model
require('../models/Dossiers');
const Dossier = mongoose.model('dossiers');

//Index Dossier Route
router.get('/',ensureAuthenticated,(req,res)=>{
    Dossier.find({user: req.user.id})
    .sort({date:'desc'})
    .then(dossiers=>{
        res.render('dossiers/index',{
            dossiers: dossiers
        });
    });
});

//Add route
router.get('/addDossier', ensureAuthenticated , (req,res)=>{
    res.render('dossiers/addDossier');
});

//Edit Form 
router.get('/edit/:id',ensureAuthenticated,(req,res)=>{
    Dossier.findOne({
        _id: req.params.id
    })
    .then(dossier => {
        if(dossier.user!=req.user.id)
        {
            req.flash('error_msg','Not authorized to change these');
            res.redirect('/dossiers');
        }
        else
        {   
        res.render('dossiers/edit',{
            dossier:dossier
        });
        }
    });
});

//Edit Form and set it in idea
router.put('/:id', ensureAuthenticated , (req,res)=>{
    Dossier.findOne({
        _id: req.params.id
    })
    .then(dossier =>{
        //new dossiers
        dossier.title = req.body.title;
        dossier.details= req.body.details;
        dossier.save()
        .then(idea=>{
            req.flash('success_msg', 'Dossier updated');
            res.redirect('/dossiers');
        });
    });
});

//Process Form
router.post('/', ensureAuthenticated ,(req,res)=>{
    let errors = [];
    if(!req.body.title)
    {
        errors.push({text:'Please enter the Title'});
    }
    if(!req.body.details)
    {
        errors.push({text:'Enter details about your day'});
    }
    if(errors.length > 0 )
    {
        res.render('dossiers/addDossier', {
            errors: errors,
            title: req.body.title,
            details: req.body.details 
        });
    }
    else
    {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }

        new Dossier(newUser)
        .save()
        .then(idea => {
            req.flash('success_msg', 'New Dossier added');
            res.redirect('/dossiers');
        });  
    }
});

//Delete Dossier
router.delete('/:id',ensureAuthenticated, (req,res)=>{
    Dossier.remove({
        _id: req.params.id
    })
    .then(()=>{
        req.flash('success_msg','Dossier Removed Successfully');
        res.redirect('/dossiers');
    })
});

module.exports = router;