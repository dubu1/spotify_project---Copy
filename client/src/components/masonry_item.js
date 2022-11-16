import React from 'react'

import { Card, Image, Mask, Text } from 'gestalt'
import '../css/masonry_item.css'

export function MasonryItem ({ data }) {
    console.log(data)
    const getImage = () => {
        if (data.type === 'track') return data.album.images[0]
        else return data.images[0]
    }

    return (
        <div className="my-masonry-item">
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

                // eslint-disable-next-line react/no-children-prop
                children={
                    <>
                        <Text align="center">{data.name}</Text>
                        {/* <Text align="center">{props.data.id}</Text> */}
                    </>
                }
            />
        </div>

    )
}
