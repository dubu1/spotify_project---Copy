
const search = async ({ query, type, market = undefined, limit = undefined, offset = undefined }, callbackFunc) => {
    const res = await fetch(`/spotify/search?q_param=${query}&type_param=${type}&market_param=${market}&limit_param=${limit}&offset_param=${offset}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    const json = await res.json()
    await callbackFunc(json)
}

const getUserFollowing = async (callbackFunc) => {
    const res = await fetch('/spotify/get_user_following', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    const json = await res.json()
    console.log(json)
    callbackFunc(json)
}

const getSongFeedAuthed = async (callbackFunc) => {
    const res = await fetch('/spotify/get_song_feed_logged_in', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    const json = await res.json()
    callbackFunc(json)
}

const getSongFeedUnauthed = async (data, callbackFunc) => {
    const res = await fetch('/spotify/get_song_feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.items)
    })
    const json = await res.json()
    callbackFunc(json)
}

const spotifyFollowArtist = async (artistID) => {
    const res = await fetch('/spotify/follow_artist', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({ artist_id: artistID })
    })
    const json = await res.json()
    return json
}

const spotifyUnfollowArtist = async (artistID) => {
    const res = await fetch('/spotify/unfollow_artist', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({ artist_id: artistID })
    })
    const json = await res.json()
    return json
}

const spotifyGetArtistAlbums = async (artistID) => {
    const res = await fetch(`/spotify/get_artist_albums?artist_id=${artistID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
    const json = await res.json()
    return json
}

const spotifyGetAlbumTracks = async (albumID) => {
    const res = await fetch(`/spotify/get_album_tracks?album_id=${albumID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
    const json = await res.json()
    return json
}

const spotifyGetDefaultExplore = async () => {
    const genres = ['anime', 'dance', 'edm', 'hip-hop', 'j-rock', 'k-pop', 'pop', 'sad']
    const query = `genre:${genres[Math.floor(Math.random() * genres.length)]}`
    const type = ['artist', 'album', 'track']
    const res = await fetch(`/spotify/search?q_param=${query}&type_param=${type}&market_param=${'GB'}&limit_param=${20}&offset_param=${0}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
    const json = await res.json()
    return json
}

const spotifyGetArtistData = async (artistID) => {
    const res = await fetch(`/spotify/get_artist_data?artist_id=${artistID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
    const json = await res.json()
    return json
}

const spotifyGetAlbumData = async (albumID) => {
    const res = await fetch(`/spotify/get_album_data?album_id=${albumID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }
    })
    const json = await res.json()
    return json
}

const spotifySignIn = async (callbackFunc) => {
    const res = await fetch('/spotify/login', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'origin'
        },
        withCredentials: true,
        credentials: 'include'
    })
    const json = await res.json()
    callbackFunc(json.url)
}

export { search, spotifySignIn, getUserFollowing, getSongFeedUnauthed, getSongFeedAuthed, spotifyFollowArtist, spotifyUnfollowArtist, spotifyGetArtistAlbums, spotifyGetDefaultExplore, spotifyGetAlbumTracks, spotifyGetArtistData, spotifyGetAlbumData }
