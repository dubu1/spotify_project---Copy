import React, { useState } from 'react'

import { Box, Button, Card, Flex, Image, Mask, TapArea, Text } from 'gestalt'
import { useNavigate } from 'react-router-dom'
import '../css/masonry_item.css'

export function MasonryItem ({ data }) {
    const isMobile = window.screen.width < 1280
    const [showHover, setShowHover] = useState(false)
    const [tap, setTap] = useState(true)
    const navigate = useNavigate()

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
            navigate(`/?${data.type}=${data.id}`)
        }
    }

    return (

        <div className="my-masonry-item">
            <TapArea rounding={1} tapStyle='compress' disabled={!tap} onTap={() => { handleTap() }}>
                <Card
                    image={
                        <Mask height={235} width={235} rounding={2}>
                            <Box height={235} width={235} >
                                <Image
                                    alt={data.name}
                                    naturalHeight={getImage().height}
                                    naturalWidth={getImage().width}
                                    src={getImage().url}
                                    fit="cover"
                                />
                            </Box>
                        </Mask>

                    }
                    onMouseEnter={() => { if (!showHover) { setShowHover(true) } }}
                    onMouseLeave={() => { if (showHover) { setShowHover(false) } }}
                >

                    <Flex justifyContent='center'>

                        <Text align="center" lineClamp={1}>
                            <div style={{ textAlign: 'center', display: 'inline', fontWeight: 'bold', fontStyle: 'italic', color: data.type === 'artist' ? '#bf4040' : '#4066bf' }}>{data.type.toUpperCase()}: </div>
                            <Text align="center" inline weight='bold'>{data.name}</Text>
                        </Text>

                        {showHover &&
                            <div className='my-hover-item' style={{ zIndex: '99' }} >
                                <Box top left position='absolute' width='100%' >
                                    <Flex justifyContent='center'>
                                        {data.type === 'artist' &&
                                            <Box>
                                                {data.isFollowing === true
                                                    ? <TapArea onMouseEnter={() => { setTap(false) }} onMouseLeave={() => { setTap(true) }} onTap={() => { data.followCb(data) }}>
                                                        <Button text='Unfollow' />
                                                    </TapArea>
                                                    : <TapArea onMouseEnter={() => { setTap(false) }} onMouseLeave={() => { setTap(true) }} onTap={() => { data.followCb(data) }}>
                                                        <Button text='Follow' />
                                                    </TapArea>
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
