const updateToken = async (id, accessToken, refreshToken) => {
    const data = {
        accessToken, refershToken: refreshToken
    }

    const res = await fetch(`/firebase/update/${id}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
    })
    const json = await res.json()
}

const getUserToken = async () => {
    const res = await fetch('/firebase/get_user_token', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'

    })
    const json = await res.json()
    return json
}

const unlinkSpotifyAccount = async () => {
    const res = await fetch('/firebase/unlink_spotify', {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const json = await res.json()
    return json
}

export { updateToken, getUserToken, unlinkSpotifyAccount }
