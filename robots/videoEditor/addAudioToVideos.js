const path = require('path')
const fs = require('fs')

const { exec } = require('child_process')

async function addAudioToVideos(state) {
    console.log(`> videoEditorRobot: Adding audio to videos...`)
    
    const baseFolder = state.searchRedditPage

    const filesPath = path.join(__dirname, '..', '..', baseFolder)

    const files = fs
        .readdirSync(filesPath)
        .map(mapFilesWithMP3andMP4)

    function mapFilesWithMP3andMP4(value, _index, array) {
        if (value.endsWith('.mp4')) {
            const finder = file => file.endsWith('.mp3') && value.split('.')[0].startsWith(file.split('.')[0])
            const fileAudio = array.find(finder)

            if (fileAudio) return [value, fileAudio]
        }
        return value
    }

    for (const file of files) {
        if (Array.isArray(file)) {
            const [video, audio] = file

            const newFileName = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, video.length)

            const videoPath = path.join(filesPath, video)
            const audioPath = path.join(filesPath, audio)

            const script = [`ffmpeg`,
                `-i ${videoPath}`,
                `-i ${audioPath}`,
                `-map 0:v -map 1:a -c:v copy -shortest`,
                `${path.join(filesPath, newFileName)}.mp4`].join(' ')

            console.log(`> videoEditorRobot: Executing script: ${script}`)

            await new Promise(resolve => exec(script, error => error ? console.error(error) : resolve()))

            console.log(`> videoEditorRobot: Deleting used files.`)

            const videoAndAudioPaths = [videoPath, audioPath]
            videoAndAudioPaths.forEach(fs.unlinkSync)
        }
    }
}

module.exports = addAudioToVideos