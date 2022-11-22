import 'gestalt/dist/gestalt.css'
import React, { useState, useRef, createContext } from 'react'

import { Box, Button, Flex, Tabs, Text } from 'gestalt'
import { useOutletContext, useSearchParams } from 'react-router-dom'

import { DisplayData } from '../class/display_data_class'
import { CurrentItemBanner } from '../components/current_item_banner'
import { FollowedSearch } from '../components/followed_search'
import { Results } from '../components/results'
import { Search } from '../components/search'
import { SongFeedSearch } from '../components/song_feed_search'
import { spotifyGetDefaultExplore, getUserFollowing, spotifyFollowArtist, spotifyUnfollowArtist, spotifyGetArtistAlbums, spotifyGetAlbumTracks, spotifyGetArtistData, spotifyGetAlbumData } from '../routes/spotify'
import { saveLocalStorageData, getLocalStorageData } from '../utils/local_storage'

export const SearchContext = createContext()
const tabs = [
    { href: '/explore', text: 'Explore' },
    { href: '/following', text: 'Followed Artists' },
    { href: '/new-songs', text: 'New Songs' }
]
const currentActionList = []

export default function FrontPage () {
    const [windowSize, setWindowSize] = useState(getWindowSize())
    const [exploreData, setExploreData] = useState(new DisplayData({}))
    const [followingData, setFollowingData] = useState(new DisplayData({}))
    const [songFeedData, setSongFeedData] = useState(new DisplayData({}))
    const [loggedIn, setLoggedIn] = useOutletContext()
    const [activeIndex, setActiveIndex] = React.useState(0)
    const [searchParams, setSearchParams] = useSearchParams()
    const [bannerData, setBannerData] = useState(null)

    // change tab index
    const handleTabChange = ({ activeTabIndex, event }) => {
        history.pushState({}, '', tabs[activeTabIndex].href)
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

    // execute search query if it exists
    React.useEffect(() => {
        const setAlbumExplore = async (data) => {
            const tracks = await spotifyGetAlbumTracks(data)
            const newDisplayData = new DisplayData({})
            newDisplayData.setDataItems(tracks)
            if (currentActionList.at(-1) !== 'album') { return }
            currentActionList.length = 0
            const album = await spotifyGetAlbumData(data)
            setBannerData(album)
            setExploreData(newDisplayData)
        }
        const setArtistExplore = async (data) => {
            const albums = await spotifyGetArtistAlbums(data)
            const newDisplayData = new DisplayData({})
            newDisplayData.setDataItems(albums)
            if (currentActionList.at(-1) !== 'artist') { return }
            currentActionList.length = 0
            const artist = await spotifyGetArtistData(data)
            setBannerData(artist)
            setExploreData(newDisplayData)
        }
        const setDefaultExplore = async () => {
            const data = await spotifyGetDefaultExplore()
            const newDisplayData = new DisplayData({})
            newDisplayData.setData(data)
            if (currentActionList.at(-1) !== 'explore') { return }
            currentActionList.length = 0
            setBannerData(null)
            setExploreData(newDisplayData)
        }

        const urlParams = new URLSearchParams(searchParams)
        if (urlParams.toString() === '') {
            currentActionList.push('explore')
            setDefaultExplore()
        } else if (urlParams.has('artist')) {
            currentActionList.push('artist')
            setArtistExplore(urlParams.get('artist'))
        } else if (urlParams.has('album')) {
            currentActionList.push('album')
            setAlbumExplore(urlParams.get('album'))
        }
        console.log(currentActionList)
    }, [searchParams])

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
                newDisplayData.setDataItems(data)
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

    // callbacks for masonry
    const masonryCBs = {
        // callbacks to add or remove from following list
        followingCBs: {
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
    }

    return (
        <Box margin={2} >
            <Flex justifyContent='start'>
                <Box paddingX={12} marginTop={0}>
                    <Tabs activeTabIndex={activeIndex} onChange={handleTabChange} tabs={tabs} />
                </Box>
            </Flex>

            <SearchContext.Provider value={[exploreData, followingData, songFeedData, new DisplayData({})][activeIndex].isEmpty()}>
                <Flex justifyContent="center" alignItems="start" direction="column">
                    { activeIndex === 0 ? <> <Search setData={displayDataHandler.setData} /> <CurrentItemBanner bannerData={bannerData}/> </> : null }
                    { activeIndex === 1 ? <FollowedSearch setData={displayDataHandler.setData} loggedIn={loggedIn}/> : null }
                    { activeIndex === 2 ? <SongFeedSearch setData={displayDataHandler.setData} loggedIn={loggedIn} followingData={followingData}/> : null }
                    <Results windowSize={windowSize} displayData={[exploreData, followingData, songFeedData, new DisplayData({})][activeIndex]} followingData={followingData} addNextData={displayDataHandler.addNextData} masonryCBs={masonryCBs} />
                </Flex>
            </SearchContext.Provider>
        </Box>
    )

    function getWindowSize () {
        const { innerWidth, innerHeight } = window
        return { innerWidth, innerHeight }
    }
}
