const express = require('express')
const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname, 'client')))

app.get('/', (req, res) => {
    res.sendFile(path.join(path.join(__dirname, 'client', 'index.html')))
})


module.exports = app