
class Album {
    constructor (data) {
        this.name = data.name
        this.id = data.id
        this.releaseDate = data.release_date
        this.albumType = data.album_type
        this.artists = data.artists
        this.href = data.href
        this.images = data.images
        this.type = data.type
    }
}

module.exports = Album
