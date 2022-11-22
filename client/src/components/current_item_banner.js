import React, { useState, useEffect } from 'react'

import { prominent } from 'color.js'
import { Box, Button, ButtonGroup, Flex, Image, Mask, Text } from 'gestalt'
import styled, { keyframes } from 'styled-components'

import 'gestalt/dist/gestalt.css'
import '../css/current_item_banner.css'
import { RGBToHSL } from '../utils/rgb_to_hsl'

const Gradient = keyframes`
    0% {
        background-position: 0% 50%;
    }
    100% {
        background-position: 100% 50%;
    }
`

export function CurrentItemBanner ({ bannerData }) {
    console.log(bannerData)
    const [colors, setColors] = useState(null)

    useEffect(() => {
        if (bannerData) {
            prominent(bannerData.images[0].url, { amount: 2 }).then(resultColors => {
                resultColors = resultColors.map(color => {
                    const hsl = RGBToHSL(color)
                    return `hsl(${hsl[0]}, ${hsl[1]}%, ${hsl[2] * 1.7 > 90 ? 80 : hsl[2] * 1.7}%)`
                })
                console.log(resultColors.join() + ',' + resultColors.join())
                setColors(resultColors.join() + ',' + resultColors.join())
            })
        }
    }, [bannerData])

    const BannerDiv = styled.div`
    background: linear-gradient(-45deg, ${colors});
    background-size: 400% 400%;
    border-radius: 15px;
    padding-top: 20px;
    padding-bottom: 20px;
    width: 90%;
    animation: ${Gradient} 100s ease-in-out forwards infinite, fadeIn 1s ease;
`

    return (
        <>
            {bannerData === null
                ? <></>
                : <Box display='flex' justifyContent='center' width='100%' paddingY={6}>
                    <BannerDiv>
                        <Flex justifyContent='center' direction='row' alignItems='center' gap={10} grow>
                            <div style={{ boxShadow: '#ffffff 0px 0px 0px 3px', borderRadius: '12.5px' }}>
                                <Mask rounding={3}>
                                    <div style={{ width: '13vw', height: '13vw', minWidth: '200px', minHeight: '200px' }}>
                                        <Image
                                            color='black'
                                            alt={bannerData.name}
                                            naturalHeight={1}
                                            naturalWidth={1}
                                            src={bannerData.images[0].url}
                                            fit="cover"
                                        />
                                    </div>
                                </Mask>
                            </div>
                            <Box display='flex' direction='column' >
                                <div style={{ fontWeight: 'bold', fontSize: '4vb', fontStyle: 'italic', color: 'white', paddingLeft: '10px', position: 'relative', bottom: '-20px', textShadow: '.05em .05em 0 hsl(200 40% 30%)' }}>{bannerData.type.toUpperCase()}</div>
                                <div style={{ fontWeight: 'bold', fontSize: '6vb', fontStyle: 'normal', color: 'white', position: 'relative', top: '-5px', textShadow: '.05em .05em 0 hsl(200 40% 30%)' }}>{bannerData.name.toUpperCase()}</div>
                            </Box>
                            <Flex.Item >
                                <ButtonGroup>
                                    <Button text='Follow' size='lg' iconEnd='add' />
                                    <Button text='Visit Spotify Page' size='lg' iconEnd='visit' role='link' href={bannerData.external_urls.spotify} />
                                </ButtonGroup>
                            </Flex.Item>
                        </Flex>
                    </BannerDiv>
                </Box>
            }
        </>

    )
}
