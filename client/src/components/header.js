import 'gestalt/dist/gestalt.css'
import '../css/header.css'
import React, { useState, useRef } from 'react'

import { Box, Button, Dropdown, Flex, TapArea } from 'gestalt'
import { useNavigate } from 'react-router-dom'

import { login, logout } from '../routes/login'
import { HelperButtons } from './helper_buttons'
import { Login } from './login'

export function Header ({ loggedIn, setLoggedIn }) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [showLoginModal, setShowLoginModal] = useState(false)
    const [headingExpanded, setHeadingExpanded] = useState(true)
    const anchorRef = useRef(null)
    const navigate = useNavigate()

    return (
        <Flex
            width="100%"
            height="100%"
            justifyContent="center"
            alignItems="center"
        >

            { showLoginModal && <Login showLogin={showLoginModal} setShowLogin={setShowLoginModal} setLoggedIn={setLoggedIn} /> }

            <Box
                paddingX={12}
                width="100%"
                dangerouslySetInlineStyle={{
                    __style: {
                        backgroundColor: '#121212'
                    }
                }}
            >
                {/* <Button onClick={(()=>{
                            setHeadingExpanded(!headingExpanded)

                        })}
                        /> */}

                <div style={{ paddingBlock: headingExpanded ? '1rem' : '3rem' }} className="my-heading">
                    <Flex justifyContent="between" alignItems="center">
                        <Box>
                            <TapArea fullWidth="false" fullHeight="false" onMouseDown={() => { navigate('/') }}>
                                <h1 style={{ color: '#ffffff' }} className=".font-face-montserrat">
                                Song Feed
                                </h1>
                            </TapArea>
                        </Box>

                        <Box paddingX="6" >
                            <Button
                                accessibilityControls="action-variant-dropdown"
                                accessibilityLabel="Menu"
                                accessibilityExpanded={menuOpen}
                                accessibilityHaspopup
                                iconEnd="arrow-down"
                                onClick={() => setMenuOpen((prevVal) => !prevVal)}
                                ref={anchorRef}
                                size="lg"
                                text="Menu"
                                color={menuOpen ? 'white' : 'transparentWhiteText'}
                            />
                            {menuOpen && (
                                <Dropdown
                                    id="action-variant-dropdown"
                                    anchor={anchorRef.current}
                                    onDismiss={() => setMenuOpen(false)}
                                >

                                    {loggedIn
                                        ? <>
                                            <Dropdown.Item
                                                onSelect={() => {
                                                    navigate('/account')
                                                    setMenuOpen(false)
                                                }}
                                                option={{ value: 'Account', label: 'Account' }}
                                            />
                                            <Dropdown.Item
                                                onSelect={() => { logout() }}
                                                option={{ value: 'Logout', label: 'Logout' }}
                                            />
                                        </>
                                        : <Dropdown.Item
                                            onSelect={() => {
                                                setShowLoginModal(true)
                                                setMenuOpen(false)
                                            }}
                                            option={{ value: 'Login', label: 'Login' }}
                                        />
                                    }

                                    <Dropdown.Item
                                        onSelect={() => { }}
                                        option={{ value: 'Settings', label: 'Settings' }}
                                    />
                                </Dropdown>
                            )}

                        </Box>

                    </Flex>
                </div>

                <Box padding={3}>
                    <Flex>
                        <HelperButtons setLoggedIn={setLoggedIn} />
                    </Flex>
                </Box>
            </Box>
        </Flex >
    )
}
