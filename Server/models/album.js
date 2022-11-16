

class Album {
    constructor(data) {       
        this.name = data.name,
        this.id = data.id,
        this.releaseDate = data.release_date,
        this.albumType = data.album_type,
        this.artists = data.artists,
        this.externalUrls = data.external_urls,
        this.href = data.href,
        this.images = data.images,
        this.tracks = []
    }

    addTrack(track) {
        this.tracks.push(track)
    }

    setTracks(list) {
        this.tracks = list
    }

    get() {
        return {
            albumType: this.albumType,
            artists: this.artists,
            externalUrls: this.externalUrls,
            href: this.href,
            id: this.id,
            images: this.images,
            name: this.name,
            releaseDate: this.releaseDate,
            tracks: this.tracks
        }
    }
}


module.exports = Album