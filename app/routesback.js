// app/routes.js
module.exports = function(app, passport) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================


    app.get('/', function(req, res) {
        res.redirect('/login'); // load the index.ejs file
    });
    app.get('/addTimetable', function(req, res) {
        res.render('addTimetable.ejs'); // load the index.ejs file
    });
    app.post('/addTimetable', function(req, res) {
        res.render('addTimetable.ejs'); // load the index.ejs file
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

    app.get('/panel', isLoggedIn, function(req, res) {
      res.redirect('/panel/'+req.user.type)
    });
    app.get('/panel/:user', isLoggedIn, function(req, res) {
      if(req.params.user=='nouser')
          res.redirect('/login')

      res.render(req.user.type+'Panel.ejs', {
            user: req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    // process the login form
    app.post('/login/:user', passport.authenticate('login', {
        successRedirect : '/panel', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));


};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
