const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/get_session', (req, res) => {
    res.send(req.session)
})

router.get('/easy_login', (req, res, next) => {
    req.body = { username: '1', password: '1' }
    passport.authenticate('local', (_err, user, options) => {
        if (options.result === 'success') {
            req.logIn(user, function (err) {
                if (err) { return next(err) }
                console.log('is authenticated?: ' + req.isAuthenticated())
                return res.redirect('/login/login_success')
            })
        }
    })(req, res, next)
})

router.get('/click', (req, res) => {
    if (req.session.clicks) {
        req.session.clicks += 1
    } else {
        req.session.clicks = 1
    }
    return req.session.save((_err) => {
        console.log(req.session)
        res.send({ message: 'ok' })
    })
})

module.exports = router
