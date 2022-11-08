import React, { useRef, useState } from 'react';
import { Box, Button, Flex, Layer, Modal, SlimBanner, Text, TextField } from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { login } from '../routes/login';


export function Login({ showLogin, setShowLogin, setLoggedIn }) {
    const [userValue, setUserValue] = useState('');
    const [passValue, setPassValue] = useState('');
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [responseError, setResponseError] = useState("");

    const inputValidation = () => {
        setUsernameError(userValue === "" ? true : false)
        setPasswordError(passValue === "" ? true : false)
    }


    const processLoginResult = ({ result, message }) => {
        if (result === "success") {
            setLoggedIn(true)
            window.location.reload(false)
        }
        else if (result === "failure") {
            setResponseError(message)
        }
        else {
            setUsernameError(true)
            setPasswordError(true)
        }
    }


    return (

        <Layer>
            <Modal
                accessibilityModalLabel="Choose how to claim site"
                align="start"
                onDismiss={() => setShowLogin(!showLogin)}
                heading="Login"
                subHeading="Log in to bookmark artists and stay up to date with their new releases!"
                footer={
                    <Flex alignItems="center" justifyContent="end" gap={2}>
                        <Button color="red" text="Login" size="lg" onClick={() => {
                            inputValidation()
                            login({ user: userValue, pass: passValue }, processLoginResult)
                        }}
                        />
                    </Flex>
                }
            >

                <Box paddingX={12} marginBottom={3}>
                    {
                        (responseError !== "") &&
                        <Box marginBottom={5}>                           
                            <SlimBanner
                                type='error'
                                iconAccessibilityLabel="Error"
                                dismissButton={{
                                    accessibilityLabel: 'Dismiss banner',
                                    onDismiss: () => {setResponseError('')},
                                  }}
                                message={responseError}
                            />
                        </Box>
                    }
                    <TextField
                        autoComplete="username"
                        id="username-text"
                        label="Username"
                        onChange={({ value }) => {
                            setUserValue(value);
                        }}
                        type="text"
                        value={userValue}
                        size="lg"
                        errorMessage={usernameError && "Username error"}
                    />
                    <TextField
                        autoComplete="current-password"
                        id="password-text"
                        label="Password"
                        onChange={({ value }) => {
                            setPassValue(value);
                        }}
                        type="password"
                        value={passValue}
                        size="lg"
                        errorMessage={passwordError && "Password error"}
                    />
                </Box>

            </Modal>
        </Layer>
    );
}
