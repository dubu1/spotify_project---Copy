import 'gestalt/dist/gestalt.css'
import './css/transitions.css'
import React, { useState, useRef } from 'react'

import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Account from './pages/account'
import FrontPage from './pages/front_page'
import Layout from './pages/layout'

function App () {
    return (

        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<FrontPage />} />
                        <Route path="/account" element={<Account />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
