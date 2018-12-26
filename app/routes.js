module.exports = function(app, passport) {
    var session = require('express-session')
    var mongoose = require('mongoose');
    var passport = require('passport');
    var LocalStrategy = require('passport-local').Strategy;
    var bcrypt = require('bcrypt-nodejs');
    var async = require('async');
    var crypto = require('crypto');
    var User = require('../app/models/user');


    app.get('/', function(req, res) {
        res.render('index.ejs');
    });


    app.get('/login', function(req, res) {

   
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/portal', 
        failureRedirect : '/login', 
        failureFlash : true 
    }));
   
    app.get('/signup', function(req, res) {

       
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

     
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/login', 
        failureRedirect : '/signup', 
        failureFlash : true 
    }));
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
    app.get('/portal', isLoggedIn, function(req, res) {
        res.render('portal.ejs', {
            user : req.user,
            message: req.flash('portalMessage')
        });
    });
    app.post('/portal', isLoggedIn, passport.authenticate('local-portal', {
        successRedirect : '/portal', 
        failureRedirect : '/portal', 
        failureFlash : true 
    }));
    app.get('/admin', isLoggedIn, function(req, res) {
        var temp=req.user;
        if(temp.local.role=="Admin")
        {
            res.render('admin.ejs', {
            user : req.user 
        });
        }
        else{
            res.render('admin1.ejs', {
            user : req.user 
            });
        }
    });
    app.get('/forgot', function(req, res) {

       
        res.render('forgot.ejs', { user: req.user ,message: req.flash('forgotMessage')});
    });

     
    app.post('/forgot', passport.authenticate('local-forgot', {
        successRedirect : '/reset', 
        failureRedirect : '/forgot', 
        failureFlash : true 
    }));

    app.get('/reset',isLoggedIn, function(req, res) {
         res.render('reset.ejs', { user: req.user ,message: req.flash('resetMessage')
        });
    });
    app.post('/reset',isLoggedIn, passport.authenticate('local-reset', {
        successRedirect : '/login', 
        failureRedirect : '/reset', 
        failureFlash : true 
    }));

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    // //angular route
    // app.get('*', function(req, res) {
    //     res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    // });
};


function isLoggedIn(req, res, next) {

   
    if (req.isAuthenticated())
        return next();

   
    res.redirect('/');
}
