import React, { useState, useEffect, useTransition } from 'react'

import 'gestalt/dist/gestalt.css'
import { Box, Button, Flex, Status, Text } from 'gestalt'
import { useOutletContext, useNavigate } from 'react-router-dom'

import { isAuthenticated } from '../routes/authenticated'
import { updateToken, getUserToken, unlinkSpotifyAccount } from '../routes/firebase'
import { spotifySignIn } from '../routes/spotify'

function Account () {
    const [loggedIn, setLoggedIn] = useOutletContext()
    const [accountConnected, setAccountConnected] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const res = checkAuthenticated()
        if (!res) {
            navigate('/')
        } else {
            getToken()
        }
    }, [loggedIn])

    const spotifySignInCallback = (url) => {
        window.open(url)
    }

    const checkAuthenticated = async () => {
        const res = await isAuthenticated()
        if (res & !loggedIn) setLoggedIn(true)
    }

    const getToken = async () => {
        const token = await getUserToken()
        if (token.accessToken !== '') {
            setAccountConnected(true)
        }
    }

    return (
        <Box height={400} >
            <Button text="get users spotify account" onClick={() => { }} />
            <Button text="get user" onClick={() => { getUserToken() }} />

            <Flex height="100%" justifyContent="center" alignItems="center" direction="column" >

                <Box padding={12}>
                    { accountConnected
                        ? <Flex direction="column" alignItems="center" gap={2}>
                            <Status type="ok" title="Spotify Status" />
                            <Text align="center" weight="bold">
                                Spotify account connected!
                            </Text>
                        </Flex>
                        : <Flex direction="column" alignItems="center" gap={2}>
                            <Status type="warning" title="Spotify Status" />
                            <Text align="center" weight="bold">
                                Spotify account not connected!
                            </Text>
                        </Flex>
                    }
                </Box>

                <Flex width="40%" justifyContent="between">
                    <Button text="Connect to Spotify" color="red" disabled={accountConnected} onClick={() => { spotifySignIn(spotifySignInCallback) }} />

                    { accountConnected
                        ? <Button text="Unlink Account" onClick={() => {
                            unlinkSpotifyAccount()
                            setAccountConnected(false)
                        }} />
                        : <Button text="Unlink Account" disabled/>
                    }
                </Flex>
            </Flex>

        </Box>
    )
};

export default Account
