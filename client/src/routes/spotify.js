
const search = async ({ query, type, market = undefined, limit = undefined, offset = undefined }, callbackFunc) => {
    const res = await fetch(`/spotify/search?q_param=${query}&type_param=${type}&market_param=${market}&limit_param=${limit}&offset_param=${offset}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
    const json = await res.json()
    callbackFunc(json)
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

const getSongFeed = async (callbackFunc) => {
    const res = await fetch('/spotify/get_song_feed', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
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

export { search, spotifySignIn, getUserFollowing, getSongFeed, spotifyFollowArtist, spotifyUnfollowArtist }
