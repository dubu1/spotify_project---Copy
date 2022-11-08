const express = require('express')
const router = express.Router()
const passport = require('passport')


router.get('/login_success', (req, res) => {
    return res.json({result:"success"})
});

router.get('/login_failure', (req, res) => {
    return res.json({result:"failure", message: req.query.message })
});

router.post("/login", (req, res, next) => {
    passport.authenticate("local", (err, user, options) => {
        if (options.result==="success") {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                console.log('is authenticated?: ' + req.isAuthenticated());
                return res.redirect('/login/login_success');
            })
        }
        
        if (options.result==="failure") {
            return res.redirect(`/login/login_failure?message=${encodeURIComponent(options.message)}`);
        }
        
    })(req, res, next)
})

router.get("/isAuthenticated", (req, res) => {
    console.log(`login.js user authenticated: ${req.isAuthenticated()}`);
    return res.json({result: req.isAuthenticated()})
})

router.delete('/logout', (req, res) => {
    console.log('logout req');

    req.logout(function(err) {
        if (err) { return next(err); }
        return res.json({result: "logged out"})
      })
})

// ##########################

function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }  
    res.redirect('/')
  }


module.exports = router