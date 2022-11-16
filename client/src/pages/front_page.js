import 'gestalt/dist/gestalt.css'
import React, { useState, useRef, createContext } from 'react'

import { Box, Flex, Tabs } from 'gestalt'
import { useOutletContext } from 'react-router-dom'

import { DisplayData } from '../class/display_data_class'
import { FollowedSearch } from '../components/followed_search'
import { Results } from '../components/results'
import { Search } from '../components/search'
import { SongFeedSearch } from '../components/song_feed_search'
import { isAuthenticated } from '../routes/authenticated'

export const SearchContext = createContext()

export default function FrontPage () {
    const [windowSize, setWindowSize] = useState(getWindowSize())

    const [exploreData, setExploreData] = useState(new DisplayData({}))
    const [followingData, setFollowingData] = useState(new DisplayData({}))
    const [songFeedData, setSongFeedData] = useState(new DisplayData({}))

    const [loggedIn, setLoggedIn] = useOutletContext()
    const [activeIndex, setActiveIndex] = React.useState(0)
    const tabs = [
        { href: '#', text: 'Explore' },
        { href: '/followed', text: 'Followed Artists' },
        { href: '/song-feed', text: 'Song Feed' }
    ]

    const handleChange = ({ activeTabIndex, event }) => {
        setActiveIndex(activeTabIndex)
        event.preventDefault()
    }

    // change window size
    React.useEffect(() => {
        function handleWindowResize () {
            setWindowSize(getWindowSize())
        }
        window.addEventListener('resize', handleWindowResize)
        return () => {
            window.removeEventListener('resize', handleWindowResize)
        }
    }, [])

    // fetch results data
    const setQueryData = data => {
        console.log(data)
        const newDisplayData = new DisplayData({})
        switch (activeIndex) {
        case 0:
            newDisplayData.setData(data)
            setExploreData(newDisplayData)
            break
        case 1:
            newDisplayData.setData(data)
            setFollowingData(newDisplayData)
            break
        case 2:
            newDisplayData.setSongFeedData(data)
            setSongFeedData(newDisplayData)
            break
        default:
            break
        }
    }

    // add to existing results data
    const addNextData = data => {
        const newDisplayData = [exploreData, followingData, songFeedData][activeIndex].clone()
        newDisplayData.appendData(data)
        switch (activeIndex) {
        case 0:
            setExploreData(newDisplayData)
            break
        case 1:
            setFollowingData(newDisplayData)
            break
        case 2:
            setSongFeedData(newDisplayData)
            break
        default:
            break
        }
    }

    return (
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

            <SearchContext.Provider value={[exploreData, followingData, songFeedData][activeIndex].isEmpty()}>
                <Flex justifyContent="center" alignItems="start" direction="column">
                    { activeIndex === 0 ? <Search setQueryData={setQueryData} /> : null }
                    { activeIndex === 1 ? <FollowedSearch setQueryData={setQueryData} loggedIn={loggedIn}/> : null }
                    { activeIndex === 2 ? <SongFeedSearch setQueryData={setQueryData} loggedIn={loggedIn}/> : null }
                    <Results windowSize={windowSize} displayData={[exploreData, followingData, songFeedData][activeIndex]} addNextData={addNextData} />
                </Flex>
            </SearchContext.Provider>
        </Box>
    )

    function getWindowSize () {
        const { innerWidth, innerHeight } = window
        return { innerWidth, innerHeight }
    }
}
