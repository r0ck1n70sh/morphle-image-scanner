const { focus, capture } = require('./api')
const { MachineState } = require('./enums')

class Machine {
    MAX_COL = 20
    MAX_ROW = 20

    constructor(io) {
        this.io = io
        this.#setState(MachineState.IDLE)
        this.#setPos({
            x: this.MAX_ROW / 2,
            y: this.MAX_COL / 2
        })
        this.queue = []
    }

    #setState(state) {
        this.io.emit('state', {state})
        this.state = state
    }

    #setPos(pos) {
        this.io.emit('pos', {pos})
        this.pos = pos
    }

    #computeQueue() {
        if (this.queue.length == 0) {
            return this.pos
        }

        const last = this.queue[this.queue.length - 1]
        this.queue = []
        return last
    }

    #captureImage(x, y) {
        this.#setPos({x, y})
        this.#setState(MachineState.CAPTURE)

        capture(x, y).then(() => {
            if (this.queue.length === 0) {
                this.#setPos({x, y})
                this.#setState(MachineState.IDLE)
                return
            }
    
            const currPos = this.#computeQueue()
            const x1 = currPos.x, y1 = currPos.y

            this.#focusImage(x1, y1)
        }).catch(e => console.error(e.message))
    }

    #focusImage(x, y) {
        this.#setPos({x, y})
        this.#setState(MachineState.FOCUS)
    
        focus(x, y).then(() => {
            if (this.queue.length === 0) {
                this.#captureImage(x, y)
                return
            }
    
            const currPos = this.#computeQueue()
            const x1 = currPos.x, y1 = currPos.y

            this.#focusImage(x1, y1)
        }).catch(e => console.error(e.message))
    }


    move(x, y) {
        console.log(`moving ${x}, ${y}`)

        if (this.state === MachineState.IDLE) {
            this.#focusImage(x, y)
            return
        }
    
        this.queue.push({x, y})
    }
}

let instance = null

const getInstance = (io = {}) => {
    if (instance == null) {
        instance = new Machine(io)
    }

    instance.io.emit('state', {state: instance.state})
    instance.io.emit('pos', {pos: instance.pos})

    return instance
}

module.exports = {
    getInstance
}