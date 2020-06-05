const whenipress = require('./../whenipress')

afterEach(() => {
    whenipress().stopAll()
})

test('registers an event listener for the given alphanumeric', done => {
    let testHelpers = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/_-*()[]{}<>?\\|:;!@£$%^&'

    testHelpers.split('').forEach(letter => {
        whenipress(letter).then(e => {
            expect(e.keys).toEqual([letter])
            done()
        })

        press(letter)
    })
})

test('can be given multiple parameters for key combinations', done => {
    whenipress('a', 'b', 'c').then(e => {
        expect(e.keys).toEqual(['b', 'a', 'c'])
        done()
    })

    press('b', 'a', 'c')
})

test('can register multiple different key combinations that share similar keys', done => {
    var pressedKeys = []
    whenipress('g', 'h', 'i').then(e => pressedKeys.push(e.keys))
    whenipress('d', 't', 'o').then(e => pressedKeys.push(e.keys))

    press('g', 'h', 'i')
    press('d', 't', 'o')

    expect(pressedKeys[0]).toEqual(['g', 'h', 'i'])
    expect(pressedKeys[1]).toEqual(['d', 't', 'o'])
    done()
})

test('can fire multiple times', done => {
    eventFiredCount = 0

    whenipress('a').then(values => {
        eventFiredCount++

        if (eventFiredCount === 2) {
            done()
        }
    })

    press('a')
    press('a')
})

test('can cleanup event listeners', done => {
    eventFiredCount = 0

    var wip = whenipress('p').then(values => {
        eventFiredCount++
    })

    var otherWip = whenipress('o').then(e => {})

    expect(whenipress().bindings().length).toBe(2)

    press('p')
    press('p')

    wip.stop()

    press('p')

    expect(eventFiredCount).toBe(2)
    expect(whenipress().bindings().length).toBe(1)

    done()
})

test('can stop all event listeners', () => {
    eventFiredCount = 0

    whenipress('a', 'b', 'c').then(e => eventFiredCount++)
    whenipress('c', 'f', 'g').then(e => eventFiredCount++)

    press('a', 'b', 'c')
    press('a', 'b', 'c')
    press('c', 'f', 'g')
    press('c', 'f', 'g')

    whenipress().stopAll()

    press('a', 'b', 'c')
    press('a', 'b', 'c')
    press('c', 'f', 'g')
    press('c', 'f', 'g')

    expect(eventFiredCount).toBe(4)
    expect(whenipress().bindings().length).toBe(0)
})

test('can retrieve all registered bindings', () => {
    whenipress('n', 'e', 's').then(e => {})
    whenipress('l', 'i', 'h').then(e => {})

    expect(whenipress().bindings()).toEqual([['n', 'e', 's'], ['l', 'i', 'h']])
})

test('can listen for an event only once', () => {
    eventFiredCount = 0

    whenipress('z').then(e => eventFiredCount++).once()

    press('z')
    press('z')
    press('z')
    press('z')

    expect(eventFiredCount).toBe(1)
})

test('can place the once modifier anywhere in the chain', () => {
    eventFiredCount = 0

    whenipress('z').once().then(e => eventFiredCount++)

    press('z')
    press('z')
    press('z')
    press('z')

    expect(eventFiredCount).toBe(1)
})

function press(...keys) {
    keys.forEach(key => dispatchKeyDown(key))
    keys.forEach(key => dispatchKeyUp(key))
}

function dispatchKeyDown(key) {
    document.dispatchEvent(new KeyboardEvent('keydown', {'key': key}))
}

function dispatchKeyUp(key) {
    document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}))
}