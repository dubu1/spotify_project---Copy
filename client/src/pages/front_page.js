import 'gestalt/dist/gestalt.css';
import { Box, Button, Flex, SegmentedControl, Tabs } from 'gestalt';
import React, { useState, useRef } from 'react';
import { Search } from "../components/search";
import { Results } from "../components/results";
import { Sidebar } from "../components/sidebar";
import { DisplayData } from "../class/display_data_class";
import { isAuthenticated, click, easyLogin } from "../routes/authenticated";
import { useOutletContext } from "react-router-dom";


export default function FrontPage() {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [displayData, setDisplayData] = useState(new DisplayData({}));
    const [loggedIn, setLoggedIn] = useOutletContext()
    const [activeIndex, setActiveIndex] = React.useState(0);

    const handleChange = ({ activeTabIndex, event }) => {
        event.preventDefault()
        console.log(event);
        setActiveIndex(activeTabIndex)
    };

    const tabs = [
        { href: "#", text: "Explore" },
        { href: "/followed", text: "Followed Artists" },
    ];

    React.useEffect(() => {
        function handleWindowResize() {
            setWindowSize(getWindowSize());
        }
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    React.useEffect(() => {
        const checkAuthenticated = async () => {
            const res = await isAuthenticated()
            setLoggedIn(res)
        }
        checkAuthenticated()
    }, []);

    // fetch results data
    const setQueryData = data => {
        const newDisplayData = new DisplayData({})
        newDisplayData.setData(data)
        setDisplayData(newDisplayData)
    }

    // add to existing results data
    const addNextData = data => {
        const newDisplayData = displayData.clone()
        newDisplayData.appendData(data)
        setDisplayData(newDisplayData)
    }

    return (
        <>
            {/* <Button text="authenticated" onClick={async () => console.log(await isAuthenticated())} />
            <Button text="click" onClick={() => click()} />
            <Button text="easy login" onClick={() => { easyLogin() }} /> */}

            {/* { windowSize.innerWidth > 900 && 
                    <Box borderStyle="lg">
                        <Sidebar />
                    </Box>
                } */}

            <Box margin={2} >
                <Flex justifyContent='start'>
                    <Box paddingX={12} marginTop={0}>
                        <Tabs
                            activeTabIndex={activeIndex}
                            onChange={handleChange}
                            tabs={tabs}
                        />
                        
                    </Box>

                </Flex>

                <Flex justifyContent="center" alignItems="start" direction="column">
                    <Search setQueryData={setQueryData} displayPage={'frontPage'} />
                    <Results windowSize={windowSize} displayData={displayData} addNextData={addNextData} />
                </Flex>
            </Box>
        </>
    );


    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }
}
