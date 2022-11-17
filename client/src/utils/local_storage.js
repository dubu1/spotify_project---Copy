
const saveLocalStorageData = (data) => {
    localStorage.setItem('followedArtists', data)
}

const getLocalStorageData = (data) => {
    return localStorage.getItem('followedArtists')
}

export { saveLocalStorageData, getLocalStorageData }
