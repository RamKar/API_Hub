var LocalStrategy   = require('passport-local').Strategy;

// load up the user model
var User            = require('../app/models/user');

var Project            = require('../app/models/project');

var Api            = require('../app/models/api');

var List            = require('../app/list');
// expose this function to our app using module.exports
module.exports = function(passport) {

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        firstNameField : 'firstName',
        lastNameField : 'lastName',
        phnoField:'phno',
        dobField:'dob',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.email     = email;
                newUser.local.password  = newUser.generateHash(password);
                newUser.local.firstName = req.body.firstName;
                newUser.local.lastName  = req.body.lastName;
                newUser.local.phno      = req.body.phno;
                newUser.local.dob       = req.body.dob;
                // save the user
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, newUser);
                });
            }

        });    

        });

    }));

     passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

            // all is well, return successful user
            else{
                    return done(null, user);
            }
        });

    }));

passport.use('local-portal', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'email',
        apiNameField: 'apiName',
        visibilityField : 'visibility',
        stateField:'state',
        apiField:'api',
        nameField:'name',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        process.nextTick(function() {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
               { return done(err);}
                // return done(null, false,req.flash('portalMessage', 'Oops! Some error occurred. Please try again in some time.'));

            // if no user is found, return the message
            if (!user)
               { return done(null, false, req.flash('portalMessage', 'User is not registered in the DB'));} // req.flash is the way to set flashdata using connect-flash

            if (req.body.api==="true")
                {
                   Api.findOne({ 'name' :  req.body.name }, function(err, api) {
                      if (err)
                         return done(err);  
                    
                      if (api)
                         return done(null, false, req.flash('portalMessage', 'Name is already taken'));

                    else{
                    
                    var newApi            = new Api();

                // set the Project's credentials
                 newApi.email     = email;
                 newApi.owner  = user.local.firstName;
                 newApi.role = user.local.role;
                 newApi.visibility  = req.body.visibility;
                 newApi.state       = req.body.state;
                 newApi.name = req.body.name;
                // save the Project
                 newApi.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                
            });
            }
            });
            }
            // all is well, return successful user
            else{
                   
                   var newProject            = new Project();

                // set the Project's credentials
                newProject.email     = email;
                newProject.owner  = user.local.firstName;
                newProject.apiName  = req.body.apiName;
                newProject.role = user.local.role;
                newProject.visibility  = req.body.visibility;
                newProject.state       = req.body.state;
                newProject.name = req.body.name;
                // save the Project
                newProject.save(function(err) {
                    if (err)
                        throw err;
                    return done(null, user);
                
            });
            }
        });
        });
    }));

    passport.use('local-forgot', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'email',
        firstNameField : 'firstName',
        dobField:'dob',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        process.nextTick(function() {
        
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
           
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('forgotMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (!((user.local.firstName===req.body.firstName)&&(user.local.dob===req.body.dob)))
                return done(null, false, req.flash('forgotMessage', 'Check your first name/Date of birth')); // create the loginMessage and save it to session as flashdata

            else{
            // all is well, return successful user
                // user.local.password = user.generateHash(password);
                // User.updateOne({'local.email': email},{'local.password': user.generateHash(password)},function(err, res) {
                // if (err) throw err;
                return done(null, user); 
                             
            }
        });
        });

    }));
    
    passport.use('local-reset', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        process.nextTick(function() {
        
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.email' :  email }, function(err, user) {
            // if there are any errors, return the error before anything else
            if (err)
                return done(err);

            // if no user is found, return the message
            if (!user)
                return done(null, false, req.flash('resetMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

            // if the user is found but the password is wrong
            if (user){
               User.updateOne({'local.email': email},{'local.password': user.generateHash(password)},function(err, res) {
                if (err) throw err;
                return done(null, user,req.flash('resetMessage', 'Password changed')); 
                }); // create the loginMessage and save it to session as flashdata
            }
            // all is well, return successful user
            return done(null, user);
        });
        });
    }));
    
};


