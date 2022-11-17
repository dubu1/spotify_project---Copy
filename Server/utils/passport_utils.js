const LocalStrategy = require('passport-local')

function initialize (passport, getUserByUsername, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = await getUserByUsername(username)
        if (user == null) {
            return done(null, false, { result: 'failure', message: 'No user with that username' })
        }
        if (user.password === password) {
            return done(null, user, { result: 'success', message: 'Successful login' })
        } else {
            return done(null, false, { result: 'failure', message: 'Password incorrect' })
        }
    }

    passport.use('local', new LocalStrategy({ username: 'username', password: 'password' }, authenticateUser))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (req, id, done) => {
        done(null, await getUserById(id))
    })
}

module.exports = initialize
