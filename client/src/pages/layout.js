import React, { useState, useRef } from "react";
import { Header } from "../components/header";
import { Outlet } from "react-router-dom";

function Layout() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <>
            <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
            <Outlet context={[loggedIn, setLoggedIn]}/>
        </>
    );
};

export default Layout;