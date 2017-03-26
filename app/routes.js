// app/routes.js
var Slots= require('../app/models/slotsModel');

module.exports = function(app, passport) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================


    app.get('/', function(req, res) {
        res.redirect('/login'); // load the index.ejs file
    });
    app.get('/enroll', function(req, res) {
        res.render('enrollInCourses_studentPanel.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form

    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.get('/login/:user', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render(req.params.user+'Login.ejs', { message: req.flash('loginMessage') });
    });
    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)

    app.get('/panel/:user', isLoggedIn, function(req, res) {

      res.render(req.user.type+'Panel.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    app.get('/panel/:user/:method', isLoggedIn, function(req, res) {
      if(req.params.user=='admin'&&req.params.method=='updateTimetable'){
        Slots.getAllSlots(function(slots){
          res.render(req.params.method+'_'+req.user.type+'Panel.ejs', {
                user: req.user, // get the user out of session and pass to template
                slots: slots
            });
        });
      }
      else if(req.params.user=='student'&&req.params.method=='registerCourses'){
        Slots.getUniqueCourses(function(courseList){
          res.render(req.params.method+'_'+req.user.type+'Panel.ejs', {
                user: req.user, // get the user out of session and pass to template
                courseList: courseList
            });
        });
      }
      else{
        res.render(req.params.method+'_'+req.user.type+'Panel.ejs', {
              user: req.user // get the user out of session and pass to template
          });
        }
    });


    app.post('/panel/admin/updateTimetable', isLoggedIn, function(req, res) {
        Slots.insertCourses(req.body);
        res.redirect('/panel/admin/')
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    /*// process the login form
    app.post('/login/:user', function(req, res, next) {
      console.log(req.params.user);
      passport.authenticate('login', {
        successRedirect : '/panel', // redirect to the secure profile section
        failureFlash : true // allow flash messages
    })
  });*/
  app.post('/login/:user', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if (err) { return next(err); }
    // Redirect if it fails
    if (!user) { return res.redirect('/login/'+req.params.user); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // Redirect if it succeeds
      return res.redirect('/panel/'+user.type);
    });
  })(req, res, next);
});

};

function assign(){

}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
