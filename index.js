
const readline = require('readline-sync')

const robots = {
    search: require('./robots/search')
}

async function start() {
    const state = {}

    state.searchRedditPage = 'watchpeopledieinside' //askAndReturnAnswer('Type a Reddit page to search for: ')

    await robots.search(state)

    console.log(state)

    function askAndReturnAnswer(question) {
        return readline.question(question)
    }


}

start()