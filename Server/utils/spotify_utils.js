const XMLHttpRequest = require("xhr2");
const SPOTIFY_CONFIGS = require("../configs/spotify_configs");

const authHeader = 'Basic ' + Buffer.from(SPOTIFY_CONFIGS.CLIENT_ID + ':' + SPOTIFY_CONFIGS.CLIENT_SECRET).toString('base64')
const url = "https://accounts.spotify.com/api/token"


function getAccessToken() {
    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();

        const formParams = "grant_type=client_credentials"
        xhr.open("POST", url);
        xhr.setRequestHeader("Authorization", authHeader)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

        // get access token on success
        xhr.onload = () => {
            const status = xhr.status
            if (status === 401) {
                reject(status)
            } else if (status === 200) {
                resolve(JSON.parse(xhr.responseText).access_token)
            }
        }
        xhr.send(formParams);
    })
}

function getAccessTokenForUser(code, redirectURI) {
    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();
        const formParams = "code=" + code + "&redirect_uri=" + redirectURI + "&grant_type=authorization_code"

        xhr.open("POST", url);
        xhr.setRequestHeader("Authorization", authHeader)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

        // get access token on success
        xhr.onload = () => {
            const status = xhr.status
            if (status === 200) {
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject(JSON.parse(xhr.responseText))
            } 
        }
        xhr.send(formParams);
    })
}

function refreshAccessTokenForUser(refreshToken) {
    return new Promise(function (resolve, reject) {

        let xhr = new XMLHttpRequest();
        const formParams = "grant_type=refresh_token&refresh_token=" + refreshToken
        xhr.open("POST", url);
        xhr.setRequestHeader("Authorization", authHeader)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")

        // get access token on success
        xhr.onload = () => {
            const status = xhr.status
            if (status === 200) {
                resolve(JSON.parse(xhr.responseText))
            } else {
                reject(JSON.parse(xhr.responseText))
            } 
        }
        xhr.send(formParams);
    })
}


module.exports = {getAccessToken, getAccessTokenForUser, refreshAccessTokenForUser}