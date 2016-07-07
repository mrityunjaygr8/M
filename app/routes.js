module.exports = function(app,passport){
    app.get('/',function(req,res){
        res.render('index.ejs');
    });

     app.get('/login', function(req, res) {

            // render the page and pass in any flash data if it exists
            res.render('login.ejs', { message: req.flash('loginMessage') }); 
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect: '/profile',
            failureRedirect: '/login',
            failureFlash: true
        }));

        // =====================================
        // SIGNUP ==============================
        // =====================================
        // show the signup form
        app.get('/signup', function(req, res) {

            // render the page and pass in any flash data if it exists
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/profile',
            failureRedirect: '/signup',
            failureFlash: true
        }));

        // =====================================
        // PROFILE SECTION =====================
        // =====================================
        // we will want this protected so you have to be logged in to visit
        // we will use route middleware to verify this (the isLoggedIn function)
        app.get('/profile', isLoggedIn, function(req, res) {
            res.render('profile.ejs', {
                user : req.user // get the user out of session and pass to template
            });
        });

        // facebook route
        app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email']}));

        app.get('/auth/facebook/callback',
            passport.authenticate('facebook',{
                successRedirect: '/profile',
                failureRedirect: '/'
            }));

        app.get('/auth/twitter', passport.authenticate('twitter'));
        app.get('/auth/twitter/callback',
            passport.authenticate('twitter', {
                successRedirect: '/profile',
                failureRedirect: '/'
            }));


        app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email']}));

        app.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect: '/profile',
                failureRedirect: '/'
            }));


        // Local Authorization

        app.get('/connect/local', function(req, res){
            res.render('connect-local.ejs', {message: req.flash('loginMessage')});
        });

        app.post('/connect/local', passport.authorize('local-signup', {
            successRedirect: '/profile',
            failureRedirect: '/connect/local',
            failureFlasg: true
        }));

        // facebook authorize
        app.get('/connect/facebook', passport.authorize('facebook', {scope: 'email'}));
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect: '/profile',
                failureRedirect: '/'
            }));

        // twitter --------------------------------

        // send to twitter to do the authentication
        app.get('/connect/twitter', passport.authorize('twitter', { scope : 'email' }));

        // handle the callback after twitter has authorized the user
        app.get('/connect/twitter/callback',
            passport.authorize('twitter', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));


        // google ---------------------------------

        // send to google to do the authentication
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        // the callback after google has authorized the user
        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));



        // =====================================
        // LOGOUT ==============================
        // =====================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
    };

    // route middleware to make sure a user is logged in
    function isLoggedIn(req, res, next) {

        // if user is authenticated in the session, carry on
        if (req.isAuthenticated())
            return next();

        // if they aren't redirect them to the home page
        res.redirect('/');
}