const focus = (x, y) => new Promise(resolve => {
    console.log(`focusing -> ${x}, ${y}`)

    setTimeout(() => {
        resolve()
    }, 3000)
})

const capture = (x, y) => new Promise(resolve => {
    console.log(`capturing -> ${x}, ${y}`)

    setTimeout(() => {
        resolve()
    }, 2000)
})

module.exports = {
    focus,
    capture
}