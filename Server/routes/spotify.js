const querystring = require('querystring')

const express = require('express')
const router = express.Router()
const randomstring = require('randomstring')
const XMLHttpRequest = require('xhr2')

const env = require('../env_config')
const Album = require('../models/album')
const Track = require('../models/track')
const firebaseUtils = require('../utils/firebase_utils')
const spotifyUtils = require('../utils/spotify_utils')

let serverAccessToken = null
let state = null

function spotifySearch (params) {
    return new Promise(function (resolve, reject) {
        const xhr = new XMLHttpRequest()
        const authHeader = 'Bearer ' + serverAccessToken
        const url = `https://api.spotify.com/v1/search?q=${params.q}&type=${params.type}&market=${params.market}&limit=${params.limit}&offset=${params.offset}`

        console.log(url)
        xhr.open('GET', url)
        xhr.setRequestHeader('Authorization', authHeader)
        xhr.setRequestHeader('Accept', 'application/json')
        xhr.setRequestHeader('Content-Type', 'application/json')

        xhr.onload = () => {
            const status = xhr.status
            if (status === 401) {
                reject(status)
            } else if (status === 200) {
                resolve(xhr.responseText)
            }
        }
        xhr.send()
    })
}

/**
 * General spotify api request function for provided url
 * @param {*} url
 * @param {*} token
 * @returns
 */
async function spotifyAPIRequest (url, methodName, token) {
    const res = await fetch(url, {
        method: methodName,
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
    if (res.status === 200) {
        const json = await res.json()
        return json
    } else {
        console.log(`Spotify Request Status: ${res.status}\nMessage: ${res.message}`)
        return res.status
    }
}

/**
 * Search Spotify API
 * @param q_param - query
 * @param type_param - artist/track
 * @param limit_param -
 * @param offset_param -
 */
router.get('/search', async (req, res) => {
    if (req.query.q_param == null || req.query.type_param == null) {
        res.send('error, query or type missing')
        return
    }

    const paramsJSON = {
        q: encodeURI(req.query.q_param),
        type: encodeURI(req.query.type_param),
        limit: req.query.limit_param !== 'undefined' ? req.query.limit_param : 10,
        offset: req.query.offset_param !== 'undefined' ? req.query.offset_param : 0,
        market: req.query.market_param !== 'undefined' ? req.query.market_param : 'GB'
    }

    try {
    // try to search using query
        const searchResult = await spotifySearch(paramsJSON)
        res.json(JSON.parse(searchResult))
    } catch (e) {
    // get new access token and retry request
        serverAccessToken = await spotifyUtils.getAccessToken()
        try {
            const searchResult = await spotifySearch(paramsJSON)
            res.json(JSON.parse(searchResult))
        } catch (e) {
            console.log('Error with spotify search API: ' + e)
            res.sendStatus(e)
        }
    }
})

/**
 * Login a user to Spotify to allow for playlist access
 */
router.get('/login', function (req, res) {
    state = randomstring.generate(16)
    const scope = `user-read-private user-read-email playlist-modify-private 
    playlist-modify-public user-follow-modify user-follow-read user-library-read 
    user-library-modify app-remote-control user-read-currently-playing 
    user-modify-playback-state user-read-playback-state`

    res.json({
        url: 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: env.spotify.clientID,
            scope,
            redirect_uri: env.spotify.redirectUri,
            state
        })
    })
})

/**
 * Callback for login to retrieve access token and refresh token
 * @param resState - state to validate login request matches request made by user
 * @param code - validation code to retrieve access token from spotify
 * @returns {accessToken, refreshToken}
 */
router.get('/login_callback', async (req, res) => {
    const resState = req.query.state || null
    const code = req.query.code || null
    if (resState !== state) return
    if (!req.user) return res.send('Error, try logging in again')

    try {
        const authResponse = await spotifyUtils.getAccessTokenForUser(code, env.spotify.redirectUri)
        const accessTokenUser = authResponse.access_token
        const refreshTokenUser = authResponse.refresh_token

        console.log(`spotify.js: \nuser logged into spotify successfully \nAccess token: ${accessTokenUser}`)

        await firebaseUtils.updateUserToken(req.user.id, { accessToken: accessTokenUser, refreshToken: refreshTokenUser })
        res.redirect('/spotify/close')
    } catch (error) {
        console.error(error)
        res.json(error)
    }
})

/**
 * Callback to close window after spotify user authentication
 */
router.get('/close', (req, res) => {
    res.send('<script>window.close();</script > ')
})

const getAlbumsFromArtistID = async (artistID) => {
    const url = `https://api.spotify.com/v1/artists/${artistID}/albums?market=GB`
    const albumsRes = await spotifyAPIRequest(url, 'GET', serverAccessToken)
    // console.log(albumsRes)
    const albumsObjs = albumsRes.items.map(album => {
        return new Album(album)
    })
    return albumsObjs
}
const getAlbumFromAlbumID = async (albumID) => {
    const url = `https://api.spotify.com/v1/albums/${albumID}?market=GB`
    const albumRes = await spotifyAPIRequest(url, 'GET', serverAccessToken)
    // console.log(albumRes)
    const albumObj = new Album(albumRes)
    return albumObj
}
const getTracksFromAlbumID = async (albumID) => {
    const albumObj = await getAlbumFromAlbumID(albumID)
    const url = `https://api.spotify.com/v1/albums/${albumID}/tracks?market=GB`
    const tracksRes = await spotifyAPIRequest(url, 'GET', serverAccessToken)
    const trackObjs = tracksRes.items.map(track => {
        const trackObj = new Track(track)
        trackObj.setAlbum(albumObj)
        return trackObj
    })
    return trackObjs
}

/**
 * Get artist albums from Spotify API
 */
router.get('/get_artist_albums', async (req, res) => {
    const artistID = req.query.artist_id
    const albums = await getAlbumsFromArtistID(artistID)
    res.json(albums)
})

/**
 * Get album tracks from Spotify API
 */
router.get('/get_album_tracks', async (req, res) => {
    const albumID = req.query.album_id
    const tracks = await getTracksFromAlbumID(albumID)
    res.json(tracks)
})

/**
 * Get artist data from Spotify API
 */
router.get('/get_artist_data', async (req, res) => {
    const artistID = req.query.artist_id
    const url = `https://api.spotify.com/v1/artists/${artistID}/`
    const artist = await spotifyAPIRequest(url, 'GET', serverAccessToken)
    res.json(artist)
})

/**
 * Get album data from Spotify API
 */
router.get('/get_album_data', async (req, res) => {
    const albumID = req.query.album_id
    const url = `https://api.spotify.com/v1/albums/${albumID}/`
    const album = await spotifyAPIRequest(url, 'GET', serverAccessToken)
    res.json(album)
})

// ------- require logins ----- //

const loggedInUserRequest = async (url, method, req) => {
    if (req.user === undefined) {
        console.log('spotify.js \nuser not defined')
        return 'User not logged in'
    }

    try {
        let followingRes = await spotifyAPIRequest(url, method, req.user.accessToken)
        if (followingRes.error) {
            console.log(followingRes.error)
            if (followingRes.error.status === 401) {
                console.log('spotify.js \nget_user_following 401 token expired')
                const tokenRes = await spotifyUtils.refreshAccessTokenForUser(req.user.refreshToken)
                await firebaseUtils.updateUserToken(req.user.id, { accessToken: tokenRes.access_token })
                req.user.accessToken = tokenRes.access_token
                followingRes = await spotifyAPIRequest(url, method, req.user.accessToken)
            }
        }
        return followingRes
    } catch (e) {
        console.log(e)
        return e
    }
}

const getLatestSongsFromArtistID = async (artistID) => {
    const albumNamesRes = await spotifyAPIRequest(`https://api.spotify.com/v1/artists/${artistID}/albums`, 'GET', serverAccessToken)
    if (albumNamesRes.error) return console.log(albumNamesRes.error)
    const albumIDList = albumNamesRes.items.map(album => { return album.id })

    const albumTracksRes = await spotifyAPIRequest(`https://api.spotify.com/v1/albums?ids=${albumIDList.join()}`, 'GET', serverAccessToken)
    if (albumTracksRes.error) return console.log(albumTracksRes.error)
    const albumTrackList = albumTracksRes.albums.map(album => { return album.tracks })
    let trackIDList = albumTrackList.map(album => { return album.items })
    trackIDList = trackIDList.flat().map(track => { return track.id })

    const tracksObjList = []
    do {
        const limitedIDList = trackIDList.slice(0, 50)
        trackIDList = trackIDList.slice(51)

        const tracksRes = await spotifyAPIRequest(`https://api.spotify.com/v1/tracks?ids=${limitedIDList.join()}`, 'GET', serverAccessToken)
        if (tracksRes.error) return console.log(tracksRes.error)
        tracksObjList.push(tracksRes.tracks.map(track => { return new Track(track) }))
    } while (trackIDList > 50)

    return tracksObjList.flat()
}

/**
 * Get followed artists from Spotify API
 */
router.get('/get_user_following', async (req, res) => {
    const url = 'https://api.spotify.com/v1/me/following?type=artist'
    res.json(await loggedInUserRequest(url, 'GET', req))
})

/**
 * Get followed artists from Spotify API
 */
router.get('/get_song_feed_logged_in', async (req, res) => {
    const url = 'https://api.spotify.com/v1/me/following?type=artist'
    const followRes = await loggedInUserRequest(url, 'GET', req)
    const followingArtists = followRes.artists?.items
    let trackObjs = await Promise.all(followingArtists.map(artist => getLatestSongsFromArtistID(artist.id)))
    trackObjs = trackObjs.flat()
    trackObjs.sort((a, b) => { return Date.parse(b.releaseDate) - Date.parse(a.releaseDate) })

    res.json(trackObjs.flat())
})

/**
 * Get followed artists from Spotify API
 */
router.post('/get_song_feed', async (req, res) => {
    const followingArtists = req.body
    let trackObjs = await Promise.all(followingArtists.map(artist => getLatestSongsFromArtistID(artist.id)))
    trackObjs = trackObjs.flat()
    trackObjs.sort((a, b) => { return Date.parse(b.releaseDate) - Date.parse(a.releaseDate) })

    res.json(trackObjs.flat())
})
/**
 * Follow artist on user account
 */
router.put('/follow_artist', async (req, res) => {
    const artistID = req.body.artist_id
    const url = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistID}`
    const followRes = await loggedInUserRequest(url, 'PUT', req)
    res.json(followRes)
})

/**
 * Unfollow artist on user account
 */
router.delete('/unfollow_artist', async (req, res) => {
    const artistID = req.body.artist_id
    const url = `https://api.spotify.com/v1/me/following?type=artist&ids=${artistID}`
    const followRes = await loggedInUserRequest(url, 'DELETE', req)
    res.json(followRes)
})

module.exports = router
