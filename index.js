
const readline = require('readline-sync')

function start() {
    const state = {}

    state.searchRedditPage = askAndReturnAnswer('Type a Reddit page to search for: ')
    state.video = {
        title: askAndReturnAnswer('Type the video title: '),
        episode: askAndReturnAnswer('Type the video episode: ')
    }

    function askAndReturnAnswer(question) {
        return readline.question(question)
    }

    console.log(state)

}

start()