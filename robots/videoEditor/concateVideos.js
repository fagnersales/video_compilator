const path = require('path')
const fs = require('fs')

const { exec } = require('child_process')

async function concateVideos(state) {
    console.log(`Concatenating videos...`)

    const videos = fs.readdirSync(path.join(__dirname, 'page/videos'))

    const files = videos.map(video => `-i ${video}`)
    const concaters = videos.map((_video, index) => `[${index}:v] [${index}:a]`)

    const script = `ffmpeg ${files.join(' ')} -filter_complex "${concaters.join(' ')} concat=n=${videos.length}:v=1:a=1 [v] [a]" -map "[v]" -map "[a]" ${Date.now()}.mp4`

    console.log(`> videoEditorRobot: Running the script: ${script}`)

    await new Promise(resolve =>
        exec(script, { cwd: path.join(__dirname, 'page/videos') }, error => error === undefined 
        ? console.error(error) : resolve()))

    return console.log(`> videoEditorRobot: All videos has been compiled!`)
}

module.exports = concateVideos