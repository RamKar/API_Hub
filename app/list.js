var Project            = require('./models/project');

var User            = require('./models/user');


module.exports.getuser = function(email) {
        
        //import user info
                      
        User.findOne({ 'email' :  email }, function(err, user) {
            // if there are any errors, return the error
            if (err)
                return done(err);

            // check to see if theres already a user with that email
            if (user) {
                
               
                // if there is no user with that email
                // create the user
                var newProject            = new Project();

                // set the user's local credentials
                newProject.owner     = user.local.firstName;
                newProject.role  = user.local.role;
                newProject.email = user.local.email;
                newProject.save(function(err) {
                    if (err)
                        throw err;
                    return newProject;
                });
                return newProject;
        }
      
           
    });
    
};
module.exports.newproject=function(projectInfo){
                var newProject    = new Project();
                newProject.owner  = projectInfo.owner;
                newProject.role  = projectInfo.role;
                newProject.email = projectInfo.email;
                newProject.visibility = projectInfo.visibility;
                newProject.state = projectInfo.state;
                newProject.name = projectInfo.name;
                // save the user
                newProject.save(function(err) {
                    if (err)
                        throw err;
                    return newProject;
                });
            };

    



