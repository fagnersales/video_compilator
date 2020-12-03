
const readline = require('readline-sync')

const robots = {
    search: require('./robots/search'),
    download: require('./robots/download'),
    videoEditor: require('./robots/videoEditor')
}

async function start() {
    console.log(`> Main: Starting...`)
    
    const state = {
        baseURL: 'https://v.redd.it/'
    }

    const videoQualities = ['1080', '720', '480', '96', '2_4_M', '1_2_M']

    state.searchRedditPage = askAndReturnAnswer('Type a Reddit page to search for: ')
    state.videoAmount = askAndReturnAnswer('Type an amount of videos to be downloaded: ')

    const videoQualityIndex = askAndReturnOption(videoQualities, 'What is the best quality that you want?')
    
    state.videoQualities = videoQualities.slice(videoQualityIndex)


    await robots.search(state)
    await robots.download(state)

    await robots.videoEditor(state)
    
    function askAndReturnAnswer(question) {
        return readline.question(question)
    }

    function askAndReturnOption(options, question) {
        return readline.keyInSelect(options, question)
    }

}

start()

