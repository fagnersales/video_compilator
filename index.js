
const readline = require('readline-sync')

const robots = {
    search: require('./robots/search'),
    download: require('./robots/download')
}

async function start() {
    const state = {}

    state.searchRedditPage = askAndReturnAnswer('Type a Reddit page to search for: ')
    state.videoAmount = askAndReturnAnswer('Type an amount of videos to be downloaded: ')

    await robots.search(state)
    await robots.download(state)

    function askAndReturnAnswer(question) {
        return readline.question(question)
    }


}

start()