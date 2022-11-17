const express = require('express')

const router = express.Router()
const DB = require('../db/firestore_db')

const collectionName = 'users'

router.post('/create_user', async (req, res) => {
    if (req.body == null) {
        res.send('Error: collection name null')
        return
    }

    const status = await DB.createDocument(collectionName, req.body)
    res.json(status)
})

router.get('/get', async (req, res) => {
    const query = [req.query['1'], req.query['2'], req.query['3']]
    const result = await DB.get(collectionName, query)
    res.json(result)
})

router.get('/getByID', async (req, res) => {
    const result = await DB.getByID(collectionName, req.query.id)
    res.json(result)
})

router.put('/update/:id', async (req, res) => {
    const id = req.params.id
    const updateData = req.body
    console.log(`firebase.js Update data: ${JSON.stringify(updateData)}`)

    const result = await DB.updateDocument(collectionName, id, updateData)
    res.json(result)
})

// logged in routes

router.get('/get_user_token', async (req, res) => {
    if (req.user === undefined) {
        return console.log('firebase.js: user undefined')
    }
    const user = await fetch(`http://localhost:5001/firebase/getByID?id=${req.user.id}`, {
        method: 'GET'
    })
    const json = await user.json()
    res.json({ accessToken: json.accessToken })
})

router.put('/unlink_spotify', async (req, res) => {
    const data = { accessToken: '', refreshToken: '' }
    const result = await fetch(`http://localhost:5001/firebase/update/${req.user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })

    const json = await result.json()
    res.json(json)
})

module.exports = router
