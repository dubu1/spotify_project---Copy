const isAuthenticated = async () => {
    const res = await fetch('/login/isAuthenticated', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const json = await res.json()
    return json.result
}

const click = async () => {
    const res = await fetch('/helpers/click', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const json = await res.json()
    console.log(json)
}

const easyLogin = async () => {
    const res = await fetch('/helpers/easy_login', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const json = await res.json()
    // console.log(json);
    return json
    // window.location.reload(false)
}

const logSession = async () => {
    const res = await fetch('/helpers/get_session', {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
    const json = await res.json()
    console.log(json)
    return json
}

export { isAuthenticated, click, easyLogin, logSession }
