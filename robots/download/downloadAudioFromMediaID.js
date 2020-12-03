const { writeFileSync } = require('fs')
const { join } = require('path')

const superagent = require('superagent')

async function downloadAudioFromMediaID({ state, mediaID }) {
    try {
        const audio = await superagent.get(`${state.baseURL}${mediaID}/DASH_audio.mp4`)
        const fileName = `${mediaID}.mp3`
        const filePath = join(state.searchRedditPage, fileName)

        writeFileSync(filePath, audio.body)
        console.log(`> DownloadRobot: Audio ${fileName} has been successfully downloaded`)
    } catch (error) {
        console.log(`> DownloadRobot: ${mediaID} No such audio for this media`)
    }
}

module.exports = downloadAudioFromMediaID