const express = require('express')
const router = express.Router()
const XMLHttpRequest = require("xhr2");
const SPOTIFY_CONFIGS = require("../configs/spotify_configs");
const spotifyUtils = require("../utils/spotify_utils")
const firebase_utils = require("../utils/firebase_utils")
const randomstring = require("randomstring");
const querystring = require("querystring");

let accessToken = null
let state = null



function spotifySearch(params) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        const authHeader = 'Bearer ' + accessToken
        const url = `https://api.spotify.com/v1/search?q=${params.q}&type=${params.type}&market=${params.market}&limit=${params.limit}&offset=${params.offset}`

        console.log(url);
        xhr.open("GET", url);
        xhr.setRequestHeader("Authorization", authHeader)
        xhr.setRequestHeader("Accept", "application/json")
        xhr.setRequestHeader("Content-Type", "application/json")

        xhr.onload = () => {
            const status = xhr.status
            if (status === 401) {
                reject(status)
            } else if (status === 200) {
                resolve(xhr.responseText)
            }
        }
        xhr.send();
    })
}

/**
 * General spotify api request function for provided url
 * @param {*} url 
 * @param {*} token 
 * @returns 
 */
async function spotifyAPIRequest(url, token) {
    const res = await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    })
    return json = await res.json()
}




/**
 * Search Spotify API
 * @param q_param - query
 * @param type_param - artist/track
 * @param limit_param - 
 * @param offset_param - 
 */
router.get("/search", async (req, res) => {
    if (req.query.q_param == null || req.query.type_param == null) {
        res.send("error, query or type missing")
        return
    }

    const paramsJSON = {
        "q": encodeURI(req.query.q_param),
        "type": encodeURI(req.query.type_param),
        "limit": req.query.limit_param!="undefined" ? req.query.limit_param : 10,
        "offset": req.query.offset_param!="undefined" ? req.query.offset_param : 0,
        "market": req.query.market_param!="undefined" ? req.query.market_param : "GB"
    }

    try {
        // try to search using query
        const searchResult = await spotifySearch(paramsJSON)
        res.json(JSON.parse(searchResult))
    } catch (e) {
        // get new access token and retry request
        accessToken = await spotifyUtils.getAccessToken()
        try {
            const searchResult = await spotifySearch(paramsJSON)
            res.json(JSON.parse(searchResult))
        } catch (e) {
            console.log("Error with spotify search API: " + e)
            res.sendStatus(e)
        }
    }
})



/**
 * Login a user to Spotify to allow for playlist access
 */
router.get('/login', function (req, res) {
    state = randomstring.generate(16);
    const scope = `user-read-private user-read-email playlist-modify-private 
    playlist-modify-public user-follow-modify user-follow-read user-library-read 
    user-library-modify app-remote-control user-read-currently-playing 
    user-modify-playback-state user-read-playback-state`;

    res.json({url: 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: SPOTIFY_CONFIGS.CLIENT_ID,
            scope: scope,
            redirect_uri: SPOTIFY_CONFIGS.REDIRECT_URI,
            state: state
        })});
});


/**
 * Callback for login to retrieve access token and refresh token
 * @param resState - state to validate login request matches request made by user
 * @param code - validation code to retrieve access token from spotify
 * @returns {accessToken, refreshToken}
 */
router.get('/login_callback', async (req, res) => {
    const resState = req.query.state || null;
    const code = req.query.code || null;
    if (resState !== state) return; 
    if (!req.user) return res.send('Error, try logging in again')

    try {
        const authResponse = await spotifyUtils.getAccessTokenForUser(code, SPOTIFY_CONFIGS.REDIRECT_URI)
        const accessTokenUser = authResponse.access_token
        const refreshTokenUser = authResponse.refresh_token
        
        console.log(`spotify.js: \nuser logged into spotify successfully \nAccess token: ${accessTokenUser}`);
    
        await firebase_utils.updateUserToken(req.user.id, { accessToken: accessTokenUser, refreshToken: refreshTokenUser })
        res.redirect("/spotify/close")
        
    } catch (error) {
        console.error(error)
        res.json(error)
    }
});


/**
 * Callback to close window after spotify user authentication
 */
router.get('/close',(req, res) => {
    res.send("<script>window.close();</script > ")
})




// ------- require logins ----- // 




/**
 * Get followed artists from Spotify API
 */
 router.get("/get_user_following", async (req, res) => {
    const url = `https://api.spotify.com/v1/me/following?type=artist`
    if (req.user===undefined){
        console.log('spotify.js \nuser not defined');
        return res.json('User not logged in')
    }

    try {
        const followingRes = await spotifyAPIRequest(url, req.user.accessToken)
        if (followingRes.error) {
            console.log(followingRes.error);
            if (followingRes.error.status===401){
                console.log('spotify.js \nget_user_following 401 token expired');
                const tokenRes = await spotifyUtils.refreshAccessTokenForUser(req.user.refreshToken)
                await firebase_utils.updateUserToken(req.user.id, {accessToken: tokenRes.access_token})
                req.user.accessToken = tokenRes.access_token
                followingRes = await spotifyAPIRequest(url, req.user.token)
            }
        }
        

        console.log(followingRes);
        res.json(followingRes)
    } catch (e) {
        console.log(e);
        res.json(e)
    }
})



module.exports = router