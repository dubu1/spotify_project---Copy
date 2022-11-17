import 'gestalt/dist/gestalt.css'
import React, { useState, useRef, createContext } from 'react'

import { Box, Button, Flex, Tabs, Text } from 'gestalt'
import { useOutletContext } from 'react-router-dom'

import { DisplayData } from '../class/display_data_class'
import { FollowedSearch } from '../components/followed_search'
import { Results } from '../components/results'
import { Search } from '../components/search'
import { SongFeedSearch } from '../components/song_feed_search'
import { getUserFollowing, spotifyFollowArtist, spotifyUnfollowArtist } from '../routes/spotify'
import { saveLocalStorageData, getLocalStorageData } from '../utils/local_storage'

export const SearchContext = createContext()
const tabs = [
    { href: '#', text: 'Explore' },
    { href: '/followed', text: 'Followed Artists' },
    { href: '/song-feed', text: 'Song Feed' }
]

export default function FrontPage () {
    const [windowSize, setWindowSize] = useState(getWindowSize())
    const [exploreData, setExploreData] = useState(new DisplayData({}))
    const [followingData, setFollowingData] = useState(new DisplayData({}))
    const [songFeedData, setSongFeedData] = useState(new DisplayData({}))
    const [loggedIn, setLoggedIn] = useOutletContext()
    const [activeIndex, setActiveIndex] = React.useState(0)

    // change tab index
    const handleTabChange = ({ activeTabIndex, event }) => {
        event.preventDefault()
        setActiveIndex(3)
        setTimeout(() => {
            setActiveIndex(activeTabIndex)
        }, 1)
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

    // get following data from local on start or logged in
    React.useEffect(() => {
        if (loggedIn) {
            getUserFollowing((data) => {
                const newDisplayData = new DisplayData({})
                newDisplayData.setData(data)
                setFollowingData(newDisplayData)
            })
        } else {
            const localStorageData = JSON.parse(getLocalStorageData())
            if (!localStorageData) {
                setFollowingData(new DisplayData({}))
                saveLocalStorageData(JSON.stringify(followingData))
            } else {
                setFollowingData(new DisplayData(localStorageData))
            }
        }
    }, [loggedIn])

    // handler to handle updates to display data objects
    const displayDataHandler = {
        // update data after fetch
        setData: (data) => {
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
        },
        // add to existing results data
        addNextData: (data) => {
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

    }

    // callbacks to add or remove from following list
    const followingCBs = {
        addToFollowingCb: async data => {
            const newDisplayData = followingData.clone()
            newDisplayData.appendFollowingArtist(data)
            setFollowingData(newDisplayData)
            if (loggedIn) {
                await spotifyFollowArtist(data.id)
            } else {
                saveLocalStorageData(JSON.stringify(newDisplayData))
            }
        },
        removeFromFollowingCb: async data => {
            const newDisplayData = followingData.clone()
            newDisplayData.removeFollowingArtist(data)
            setFollowingData(newDisplayData)
            if (loggedIn) {
                await spotifyUnfollowArtist(data.id)
            } else {
                saveLocalStorageData(JSON.stringify(newDisplayData))
            }
        }

    }

    const helpers = {
        printFollowing: () => {
            console.log(followingData)
        },
        clearFollowing: () => {
            setFollowingData(new DisplayData({}))
            localStorage.removeItem('followedArtists')
        }
    }

    return (
        <Box margin={2} >
            <Flex justifyContent='start'>
                <Box paddingX={12} marginTop={0}>
                    <Tabs activeTabIndex={activeIndex} onChange={handleTabChange} tabs={tabs} />
                </Box>
            </Flex>
            {loggedIn &&
            <Text>
                logged in
            </Text>

            }

            <Button size='lg' text="print following" onClick={() => { helpers.printFollowing() }} />
            <Button size='lg' text="clear following" onClick={() => { helpers.clearFollowing() }} />

            <SearchContext.Provider value={[exploreData, followingData, songFeedData, new DisplayData({})][activeIndex].isEmpty()}>
                <Flex justifyContent="center" alignItems="start" direction="column">
                    { activeIndex === 0 ? <Search setData={displayDataHandler.setData} /> : null }
                    { activeIndex === 1 ? <FollowedSearch setData={displayDataHandler.setData} loggedIn={loggedIn}/> : null }
                    { activeIndex === 2 ? <SongFeedSearch setData={displayDataHandler.setData} loggedIn={loggedIn}/> : null }
                    <Results windowSize={windowSize} displayData={[exploreData, followingData, songFeedData, new DisplayData({})][activeIndex]} followingData={followingData} addNextData={displayDataHandler.addNextData} followingCBs={followingCBs} />
                </Flex>
            </SearchContext.Provider>
        </Box>
    )

    function getWindowSize () {
        const { innerWidth, innerHeight } = window
        return { innerWidth, innerHeight }
    }
}
