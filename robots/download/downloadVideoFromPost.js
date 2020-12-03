const { join } = require('path')

const { existsSync, mkdirSync, writeFileSync } = require('fs')

const getBestResolutionAndVideo = require('./getBestResolutionAndVideo')
const downloadAudioFromMediaID = require('./downloadAudioFromMediaID')

async function downloadVideoFromPost({ post, state }) {
    console.log(`> DownloadRobot: Starting download video from post...`)

    const mediaURL = post.videeo.urls['scrubber'].split(state.baseURL)[1]
    const mediaID = mediaURL.split('/')[0]

    console.log(`> DownloadRobot: Video scrubber_url: ${mediaURL}`)
    console.log(`> DownloadRobot: Video media ID: ${mediaID}`)

    try {
        const [resolution, video] = await getBestResolutionAndVideo({
            baseURL,
            mediaID,
            resolutions: state.videoQualities,
        })

        const buffer = (await video).body

        if (buffer) {
            console.log(`> DownloadRobot: Video downloaded with the best available resolution.`)

            const fileName = `${mediaID}_${resolution}p.mp4`
            const filePath = join(state.searchRedditPage, fileName)

            if (!existsSync(state.searchRedditPage)) {
                mkdirSync(state.searchRedditPage)
                console.log(`> DownloadRobot: Folder ${state.searchRedditPage} has been created.`)
            }

            writeFileSync(filePath, buffer)
            console.log(`> DownloadRobot: Video ${fileName} has been successfully downloaded!`)

            return downloadAudioFromMediaID({ state, mediaID })
        }
        else console.log(`> DOwnloadRobot: ${mediaID} does not has a buffer.`)

    } catch (error) {
        return console.log(`> DownloadRobot: ${mediaID} has no available resolution.`)
    }
}

module.exports = downloadVideoFromPost