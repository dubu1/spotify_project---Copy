import React, { useRef, useState, createContext } from 'react'

import { Box, Masonry } from 'gestalt'

import 'gestalt/dist/gestalt.css'
import { search } from '../routes/spotify'
import { MasonryItem } from './masonry_item'

const loadMoreItems = async (nextURL, addNextData) => {
    if (nextURL === null) return

    const urlParams = new URLSearchParams(nextURL.replace('https://api.spotify.com/v1/search?', ''))
    search({
        query: urlParams.get('query'),
        type: urlParams.get('type'),
        limit: urlParams.get('limit'),
        offset: urlParams.get('offset')
    }, addNextData)
}

export function Results ({ windowSize, displayData, followingData, addNextData, followingCBs }) {
    const [isFetching, setFetching] = useState(false)
    const scrollContainerRef = useRef(null)
    const items = displayData.items.map(item => {
        if (item.type !== 'artist') return item
        if (!followingData.idSet.includes(item.id)) {
            item.isFollowing = false
            item.cb = (data) => { followingCBs.addToFollowingCb(data) }
        } else if (followingData.idSet.includes(item.id)) {
            item.isFollowing = true
            item.cb = (data) => { followingCBs.removeFromFollowingCb(data) }
        }
        return item
    })
    const nextURL = displayData.next

    return (

        <Box
            width="100%"
            height={windowSize.innerHeight - 330}
            overflow="auto"
            ref={scrollContainerRef}
            dangerouslySetInlineStyle={{
                __style: {
                    overflowX: 'hidden',
                    scrollbarColor: 'black white',
                    scrollbarWidth: 'thin'
                }
            }}
        >

            <Masonry
                Item={MasonryItem}
                items={items}
                minCols={1}
                layout="basic"
                scrollContainer={() => scrollContainerRef.current}
                virtualize
                loadItems={ () => {
                    if (!isFetching & nextURL !== '') {
                        setFetching(true)
                        loadMoreItems(nextURL, addNextData)
                        console.log(`next data fetch done, next url: ${nextURL}`)
                        setFetching(false)
                    }
                }}
            />

        </Box>
    )
}
