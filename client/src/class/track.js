
export class Track {
    constructor (data) {
        this.releaseDate = ''
        this.album = data.album
        this.name = data.name
        this.artists = data.artists
        this.popularity = data.popularity
        this.id = data.id
        this.href = data.href
        this.externalUrls = data.external_urls
        this.previewUrl = data.preview_url
        this.trackNumber = data.track_number
    }

    setReleaseDate (releaseDate) {
        this.releaseDate = releaseDate
    }
}
