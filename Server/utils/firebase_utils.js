const firebase = require('firebase/app')
const firestore = require('firebase/firestore')

const FIREBASE_CONFIG = require('../configs/firebase_configs')

// Initialize Firebase
const app = firebase.initializeApp(FIREBASE_CONFIG.FIREBASE_CONFIG)
const db = firestore.getFirestore(app)

const getUserByUsername = async (username) => {
    const res = await fetch(`http://localhost:5001/firebase/get?1=username&2===&3=${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'origin'
        }
    })
    const arr = await res.json()
    return arr[0]
}

const getUserByID = async (id) => {
    const res = await fetch(`http://localhost:5001/firebase/getByID?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'origin'
        }
    })
    const json = await res.json()
    json.id = id
    return json
}

const updateUserToken = async (id, data) => {
    const res = await fetch(`http://localhost:5001/firebase/update/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'origin'
        },
        body: JSON.stringify(data)

    })
    const json = await res.json()
    return json
}

const utils = {
    db,
    firestore,
    getUserByUsername,
    getUserByID,
    updateUserToken
}

module.exports = utils
