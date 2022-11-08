
const search = async ({query, type, market=undefined, limit=undefined, offset=undefined}, callbackFunc) => {
    const res = await fetch(`/spotify/search?q_param=${query}&type_param=${type}&market_param=${market}&limit_param=${limit}&offset_param=${offset}`, {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    const json = await res.json()
    callbackFunc(json)
}

const getUserFollowing = async (callbackFunc) => {
    const res = await fetch(`/spotify/get_user_following`, {
        method: "GET",
        headers: {'Content-Type': 'application/json'},
    })
    const json = await res.json()
    console.log(json);
    callbackFunc(json)
}

const spotifySignIn = async (callbackFunc) => {
    const res = await fetch(`/spotify/login`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin' : 'origin'
        },
        withCredentials: true,
        credentials: 'include',
    })
    const json = await res.json()
    callbackFunc(json.url)
}

export {search, spotifySignIn, getUserFollowing}