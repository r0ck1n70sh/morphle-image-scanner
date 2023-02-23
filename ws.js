const http = require('http')
const socketIO = require('socket.io')

const app = require('./app')
const { getInstance } = require('./machine/instance')

const ws = http.createServer(app)
const io = socketIO(ws)

io.on('connection', function(socket) {
    getInstance(io)

    socket.on('move', function(req) {
        const { x, y } = req.pos
        console.log(`moving -> ${x}, ${y}`)
            
        const instance = getInstance()
        instance.move(x, y)
    })
})

module.exports = ws
