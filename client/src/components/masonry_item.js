import React, { useState } from 'react'

import { Box, Button, Card, Flex, Image, Mask, TapArea, Text } from 'gestalt'

import '../css/masonry_item.css'

export function MasonryItem ({ data }) {
    const isMobile = window.screen.width < 1280
    const [showHover, setShowHover] = useState(false)
    const getImage = () => {
        if (data.type === 'track') return data.album.images[0]
        else return data.images[0]
    }

    const handleTap = () => {
        const mobileTap = () => {
            if (!showHover && isMobile) {
                setShowHover(true)
            } else if (showHover && isMobile) {
                setShowHover(false)
            }
        }
        mobileTap()

        if (data.type === 'artist' || data.type === 'album') {
            data.setExploreCb(data.id)
        }
    }

    return (

        <div className="my-masonry-item">
            <TapArea rounding={1} tapStyle='compress' onTap={() => { handleTap() }}>
                <Card
                    image={
                        <Mask height={220} rounding={1}>
                            <Image
                                alt={data.name}
                                naturalHeight={getImage().height}
                                naturalWidth={getImage().width}
                                src={getImage().url}
                                fit="cover"
                            />
                        </Mask>

                    }
                    onMouseEnter={() => { if (!showHover) { setShowHover(true) } }}
                    onMouseLeave={() => { if (showHover) { setShowHover(false) } }}
                >

                    <Flex justifyContent='center'>

                        <Text align="center" lineClamp={1}>
                            <Text align="center" inline italic weight='bold' color='subtle'>{data.type.toUpperCase()}: </Text>
                            <Text align="center" inline weight='bold'>{data.name}</Text>
                        </Text>

                        {showHover &&
                            <div className='my-hover-item' style={{ zIndex: '99' }} >
                                <Box top left position='absolute' width='100%' borderStyle='lg' >
                                    <Flex justifyContent='center'>
                                        {data.type === 'artist' &&
                                            <Box>
                                                {data.isFollowing === true
                                                    ? <Button text='Unfollow' onClick={() => { data.followCb(data) }} />
                                                    : <Button text='Follow' onClick={() => { data.followCb(data) }} />
                                                }
                                            </Box>
                                        }

                                    </Flex>
                                </Box>
                            </div>
                        }
                    </Flex>

                </Card>
            </TapArea>
        </div>

    )
}
