/* eslint-disable import/order */
/* eslint-disable no-use-before-define */
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const express = require('express')
const session = require('express-session')
const methodOverride = require('method-override')
const passport = require('passport')

const initializePassport = require('./utils/passport_utils')
const serverConfigs = require('./configs/server_configs')

const app = express()
const PORT = 5001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true // <= Accept credentials (cookies) sent by the client
}))
app.use(cookieParser())
app.use(session({
    key: 'sid',
    secret: serverConfigs.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        sameSite: 'none',
        httpOnly: true,
        secure: false,
        maxAge: 1000000000 // ten seconds, for testing
    }

}))

initializePassport(
    passport,
    username => firebaseUtils.getUserByUsername(username),
    id => firebaseUtils.getUserByID(id)
)

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://accounts.spotify.com')
    // res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Credentials', true)
    next()
})

const firebaseRouter = require('./routes/firebase')
const helperRouter = require('./routes/helpers')
const loginRouter = require('./routes/login')
const spotifyRouter = require('./routes/spotify')
const firebaseUtils = require('./utils/firebase_utils')
app.use('/firebase', firebaseRouter)
app.use('/spotify', spotifyRouter)
app.use('/login', loginRouter)
app.use('/helpers', helperRouter)

app.listen(PORT, () => { console.log('server started on port %d', PORT) })
