import React, { useState, useRef } from 'react';
import { Box, Button, Switch, Label, Text, Flex, SearchField, Popover } from 'gestalt';
import 'gestalt/dist/gestalt.css';
import { search, getUserFollowing } from '../routes/spotify';

export function Search({ setQueryData, displayPage }) {
    const [searchText, setSearchText] = useState("");
    const [artistSwitched, setArtistSwitched] = useState(true);
    const [tracksSwitched, setTracksSwitched] = useState(displayPage==='frontPage'?true:false);
    const [albumsSwitched, setAlbumsSwitched] = useState(displayPage==='frontPage'?true:false);
    const anchorRef = useRef();
    const limit = 7;
    const market = "GB";

    const getTypes = () => {
        const type = []
        if (artistSwitched) type.push("artist");
        if (tracksSwitched) type.push("track");
        if (albumsSwitched) type.push("album");
        return type.join()
    }

    const searchTabs = () => {
        if (displayPage==="frontPage") {
            return (
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
            )
        }
    }

    const searchButton = () => {
        return (
            <Button
            size='lg'
            text="Search"
            onClick={() => {
                if (displayPage){
                    search({
                        query: searchText,
                        type: getTypes(),
                        limit: limit,
                        market: market
                    }, setQueryData)
                } else {
                    getUserFollowing(setQueryData)
                }

            }
                
        } />
        )
    }

    return (

        <Box width="55%" marginBottom={8} marginTop={4} marginEnd={3} alignSelf="center">

            { searchTabs() }

            <Flex gap={2}>
                <Flex.Item flex="grow" >
                    <SearchField
                        size='lg'
                        accessibilityLabel="Search Bar"
                        accessibilityClearButtonLabel="Clear search field"
                        placeholder={displayPage==="frontPage" ? "Search for artist, track or song": "Search" }
                        id="spotifySearchField"
                        value={searchText}
                        onChange={(val) => { setSearchText(val.value) }}
                        onKeyDown={(props) => {
                            const keyPressed = props.event.code

                            if (keyPressed === "Enter") {
                                search({
                                    query: searchText,
                                    type: getTypes(),
                                    limit: limit,
                                    market: market
                                }, setQueryData)
                            }
                        }}
                    />
                </Flex.Item>
                { searchButton() }
            </Flex>



            {(!artistSwitched && !albumsSwitched && !tracksSwitched) &&
            <Box
            dangerouslySetInlineStyle={{
                __style: {
                    opacity:"0.8",
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

    );
}
