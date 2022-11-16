const login = async ({ user, pass }, processResult) => {
    const data = {
        username: user,
        password: pass
    }
    const res = await fetch('/login/login', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include',
        body: JSON.stringify(data)
    })
    const json = await res.json()
    console.log(json)
    processResult(json)
}

const logout = async () => {
    const res = await fetch('/login/logout?_method=DELETE', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        withCredentials: true,
        credentials: 'include'
    })
    const json = await res.json()
    console.log(json)
    window.location.reload(false)
}

export { login, logout }
