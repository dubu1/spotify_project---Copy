
class Track {
    constructor (data) {
        this.releaseDate = data.album.release_date
        this.album = data.album
        this.name = data.name
        this.artists = data.artists
        this.popularity = data.popularity
        this.id = data.id
        this.href = data.href
        this.previewUrl = data.preview_url
        this.trackNumber = data.track_number
        this.type = data.type
    }

    setReleaseDate (releaseDate) {
        this.releaseDate = releaseDate
    }
}

module.exports = Track
