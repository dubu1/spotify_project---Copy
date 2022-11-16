import React, { useState, useRef, useContext } from 'react'

import { Box, Button, Switch, Label, Text, Flex, SearchField, Popover } from 'gestalt'

import 'gestalt/dist/gestalt.css'
import { SearchContext } from '../pages/front_page'
import { search } from '../routes/spotify'

export function Search ({ setQueryData }) {
    const [searchText, setSearchText] = useState('')
    const [artistSwitched, setArtistSwitched] = useState(true)
    const [tracksSwitched, setTracksSwitched] = useState(true)
    const [albumsSwitched, setAlbumsSwitched] = useState(true)
    const displayEmpty = useContext(SearchContext)

    const genres = ['anime', 'dance', 'edm', 'hip-hop', 'j-rock', 'k-pop', 'pop', 'sad']
    const anchorRef = useRef()
    const limit = 7
    const market = 'GB'

    const getTypes = () => {
        const type = []
        if (artistSwitched) type.push('artist')
        if (tracksSwitched) type.push('track')
        if (albumsSwitched) type.push('album')
        return type.join()
    }

    // set initial search when data is empty
    React.useEffect(() => {
        if (!displayEmpty) { return }
        search({
            query: `genre:${genres[Math.floor(Math.random() * genres.length)]}`,
            type: getTypes(),
            limit,
            market
        }, setQueryData)
    }, [])

    return (

        <Box width="55%" marginBottom={8} marginTop={4} marginEnd={3} alignSelf="center">

            <div ref={anchorRef}>
                <Box marginBottom={2} marginEnd={2}>
                    <Flex justifyContent="end" gap={4}>
                        <Flex alignItems="center" gap={2}>
                            <Flex.Item flex="grow">
                                <Label htmlFor="Artist">
                                    <Text>Artists</Text>
                                </Label>
                            </Flex.Item>
                            <Switch
                                switched={artistSwitched}
                                onChange={() => setArtistSwitched(!artistSwitched)}
                                id="Artist"
                            />
                        </Flex>
                        <Flex alignItems="center" gap={2}>
                            <Flex.Item flex="grow">
                                <Label htmlFor="Tracks">
                                    <Text>Tracks</Text>
                                </Label>
                            </Flex.Item>
                            <Switch
                                switched={tracksSwitched}
                                onChange={() => setTracksSwitched(!tracksSwitched)}
                                id="Tracks"
                            />
                        </Flex>
                        <Flex alignItems="center" gap={2}>
                            <Flex.Item flex="grow">
                                <Label htmlFor="Albums">
                                    <Text>Albums</Text>
                                </Label>
                            </Flex.Item>
                            <Switch
                                switched={albumsSwitched}
                                onChange={() => setAlbumsSwitched(!albumsSwitched)}
                                id="Albums"
                            />
                        </Flex>
                    </Flex>
                </Box>
            </div>

            <Flex gap={2}>
                <Flex.Item flex="grow" >
                    <SearchField
                        size='lg'
                        accessibilityLabel="Search Bar"
                        accessibilityClearButtonLabel="Clear search field"
                        placeholder={'Search for artist, track or song'}
                        id="spotifySearchField"
                        value={searchText}
                        onChange={(val) => { setSearchText(val.value) }}
                        onKeyDown={(props) => {
                            const keyPressed = props.event.code

                            if (keyPressed === 'Enter') {
                                search({
                                    query: searchText,
                                    type: getTypes(),
                                    limit,
                                    market
                                }, setQueryData)
                            }
                        }}
                    />
                </Flex.Item>
                <Button
                    size='lg'
                    text="Search"
                    onClick={() => {
                        search({
                            query: searchText,
                            type: getTypes(),
                            limit,
                            market
                        }, setQueryData)
                    }}
                />
            </Flex>

            {(!artistSwitched && !albumsSwitched && !tracksSwitched) &&
            <Box
                dangerouslySetInlineStyle={{
                    __style: {
                        opacity: '0.8'
                    }
                }}
            >

                <Popover
                    anchor={anchorRef.current}
                    color="red"
                    idealDirection="right"
                    showCaret
                    onDismiss={() => {}}
                    positionRelativeToAnchor={false}
                    size="flexible"
                >
                    <Box padding={2}>
                        <Text color="inverse" align="center">
                        No search option selected!
                        </Text>
                    </Box>
                </Popover>
            </Box>
            }
        </Box>

    )
}
