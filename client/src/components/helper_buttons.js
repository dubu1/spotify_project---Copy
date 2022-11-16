import 'gestalt/dist/gestalt.css'
import '../css/header.css'
import React, { useState, useRef } from 'react'

import { Box, Button, Dropdown, Flex, TapArea } from 'gestalt'
import { useNavigate } from 'react-router-dom'

import { easyLogin, logSession } from '../routes/authenticated'

export function HelperButtons ({ setLoggedIn }) {
    const navigate = useNavigate()

    return (
        <>
            <Button size='lg' text="easy login" onClick={ async () => {
                if ((await easyLogin()).result === 'success') setLoggedIn(true)
            }} />
            <Button size='lg' text="to accounts" onClick={async () => {
                if ((await easyLogin()).result === 'success') {
                    setLoggedIn(true)
                    navigate('/account')
                }
            }} />
            <Button size='lg' text="log session" onClick={async () => {
                logSession()
            }} />
        </>
    )
}
