class DisplayData {
    constructor ({ items, limit, next, offset, idSet }) {
        this.items = items === undefined ? [] : items
        this.limit = limit === undefined ? -1 : limit
        this.next = next === undefined ? '' : next
        this.offset = offset === undefined ? -1 : offset
        this.idSet = idSet === undefined ? [] : idSet
    }

    setSongFeedData (data) {
        this.items = data
    }

    setData (data) {
        const [newItems, newIdSet] = this.filterData(data)
        this.items = newItems
        this.idSet = newIdSet

        if (data.artists !== undefined) {
            this.limit = data.artists.limit
            this.next = data.artists.next
            this.offset = data.artists.offset
        } else if (data.albums !== undefined) {
            this.limit = data.albums.limit
            this.next = data.albums.next
            this.offset = data.albums.offset
        } else if (data.tracks !== undefined) {
            this.limit = data.tracks.limit
            this.next = data.tracks.next
            this.offset = data.tracks.offset
        }
    }

    appendData (data) {
        const [newItems, newIdSet] = this.filterData(data)
        this.items = [].concat(this.items, newItems)
        this.idSet = [].concat(this.idSet, newItems)

        if (data.artists !== undefined) {
            this.limit += data.artists.limit
            this.next = data.artists.next
        } else if (data.albums !== undefined) {
            this.limit += data.albums.limit
            this.next = data.albums.next
        } else if (data.tracks !== undefined) {
            this.limit += data.tracks.limit
            this.next = data.tracks.next
        }
    }

    // remove items with no images
    filterData (data) {
        const itemsArr = []
        const newIdSet = []

        for (const type in data) {
            for (const item of data[type].items) {
                if (item.type === 'track' && !this.idSet.includes(item.id)) {
                    newIdSet.push(item.id)
                    itemsArr.push(item)
                } else if (item.images.length > 0 && !this.idSet.includes(item.id)) {
                    newIdSet.push(item.id)
                    itemsArr.push(item)
                }
            }
        }

        return [itemsArr, newIdSet]
    }

    // return new object with same values
    clone () {
        return new DisplayData({
            items: this.items,
            limit: this.limit,
            next: this.next,
            offset: this.offset,
            idSet: this.idSet
        })
    }

    // return true if items are empty
    isEmpty () {
        return this.items.length === 0
    }

    // adds artist to followed list
    appendFollowingArtist (data) {
        if (!this.idSet.includes(data.id)) {
            this.items.push(data)
            this.idSet.push(data.id)
        }
    }

    // remove artist from following
    removeFollowingArtist (data) {
        this.items = this.items.filter((artist) => { return artist.id !== data.id })
        this.idSet = this.idSet.filter((id) => { return id !== data.id })
    }
}

export { DisplayData }
