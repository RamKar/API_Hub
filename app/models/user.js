// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var passportLocalMongoose = require('passport-local-mongoose');
// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
        firstName    : String,
        lastName     : String,
        role         : {
                          type: String,
                          default: "User"
                       }, 

        phno         : Number,
        dob          : String
    }

});
userSchema.plugin(passportLocalMongoose, {
   selectFields : 'local.firstName local.lastName local.phno local.role local.dob' 
});
// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// userSchema.methods.validsecQ = function(temp,secQ) {
    
//     if(secQ === temp)
//         return true
//     else
//         return false
// };

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
