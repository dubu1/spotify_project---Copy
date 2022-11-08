import 'gestalt/dist/gestalt.css';
import { Box, Button, Flex, SegmentedControl, Tabs, Text } from 'gestalt';
import React, { useState, useRef } from 'react';
import { Sidebar } from "../components/sidebar";
import { DisplayData } from "../class/display_data_class";
import { isAuthenticated, click, easyLogin } from "../routes/authenticated";
import { useOutletContext } from "react-router-dom";


export default function SongFeed() {
    const [windowSize, setWindowSize] = useState(getWindowSize());
    const [displayData, setDisplayData] = useState(new DisplayData({}));
    const [loggedIn, setLoggedIn] = useOutletContext()
    const [activeIndex, setActiveIndex] = React.useState(0);

    const handleChange = ({ activeTabIndex, event }) => {
        // event.preventDefault();
        console.log(event);
        setActiveIndex(activeTabIndex)
    };

    const tabs = [
        { href: "/", text: "Explore" },
        { href: "/account", text: "Followed Artists" },
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

    function getWindowSize() {
        const { innerWidth, innerHeight } = window;
        return { innerWidth, innerHeight };
    }


    return (
        <>

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

                <Flex justifyContent="start" alignItems="center" direction="column">
                    <Box borderStyle='lg' width="80%" height={100}>
                        <Text size={200}>Impressions</Text>
                    </Box>
                    <Box borderStyle='lg'>
                        <Text size={200}>Impressions</Text>
                    </Box>
                </Flex>
            </Box>
        </>
    );
}
