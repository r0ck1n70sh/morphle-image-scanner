import { io } from 'https://cdn.socket.io/4.3.2/socket.io.esm.min.js'

const socket = io()
const MAX_COL = 20
const MAX_ROW = 20

socket.on('connect', (data) => {
    console.log('successfully connect')
})

socket.on('state', (data) => {
    const state = data.state
    
    document.getElementById('status').innerText = state
})

socket.on('pos', (data) => {
    setFocus(data.pos.x, data.pos.y)
})

function move(x, y) {
    setCursor(x, y)

    const pos = {x, y}
    socket.emit('move', { pos })
}

function getCellId(x, y) {
    return `cell_${x}_${y}`
}

function getCell(x, y) {
    const id = getCellId(x, y)
    return document.getElementById(id)
}

function setCursor(x, y) {
    if (x < 0 || x > MAX_COL || y < 0 || y > MAX_ROW) {
        return
    }

    const prevCell = getCell(cursor.x, cursor.y)
    prevCell.classList.remove('dotted')

    const currCell = getCell(x, y)
    currCell.classList.add('dotted')

    cursor.x = x
    cursor.y = y
}

function setFocus(x, y) {
    const prevCell = getCell(pos.x, pos.y)

    if (prevCell) {
        prevCell.classList.remove('focussed')
    }

    const currCell = getCell(x, y)

    if (!currCell) return
    currCell.classList.add('focussed')

    pos.x = x
    pos.y = y
}

const pos = { x:10, y:10 }
const cursor = { x:10, y:10 }

document.addEventListener('keyup', (event) => {
    const key = event.key
    let x = cursor.x
    let y = cursor.y

    switch (key) {
        case 'Up':
        case 'ArrowUp':
            y -= 1
            break

        case 'Down':
        case 'ArrowDown':
            y += 1
            break

        case 'Left':
        case 'ArrowLeft':
            x -= 1
            break

        case 'Right':
        case 'ArrowRight':
            x += 1
            break

        default:
    }
    
    move(x, y)
})


window.addEventListener('load', () => {
    const table = document.getElementById('table')

    for (let i=0; i<MAX_ROW; i++) {
        const tr = document.createElement('tr')
        for (let j=0; j<MAX_COL; j++) {
            const td  = document.createElement('td')
            td.setAttribute('id', getCellId(j, i))
            td.innerText = `${j}, ${i}`

            tr.appendChild(td)
        }
        table.appendChild(tr)
    }

    setCursor(cursor.x, cursor.y)
    setFocus(pos.x, pos.y)
})