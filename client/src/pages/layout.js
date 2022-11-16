import React, { useState, useRef, useEffect } from 'react'

import { Outlet } from 'react-router-dom'

import { Header } from '../components/header'
import { isAuthenticated } from '../routes/authenticated'

function Layout () {
    const [loggedIn, setLoggedIn] = useState(false)

    React.useEffect(() => {
        const checkAuthenticated = async () => {
            const res = await isAuthenticated()
            setLoggedIn(res)
        }
        checkAuthenticated()
    }, [])

    return (
        <>
            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <Outlet context={[loggedIn, setLoggedIn]}/>
        </>
    )
};

export default Layout
