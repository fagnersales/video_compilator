const superagent = require('superagent')

const { writeFileSync, mkdirSync, existsSync } = require('fs')
const { join } = require('path')


async function robot(state) {
    const resolutions = [1080, 720, 480, 96, '2_4_M', '1_2_M']
    const baseURL = 'https://v.redd.it/'

    await downloadVideosFromURL(state)
    
    async function downloadVideosFromURL(state) {
        
        for (const post of state.redditData.slice(0, state.videoAmount)) {
            console.log(`> DownloadRobot: Trying to download the video from the post: ${post.permalink}`)
            await tryToDownloadVideo(post)
        }

        async function tryToDownloadVideo(post) {

            const mediaURL = post.video.urls['scrubber'].split(baseURL)[1]
            const mediaID = mediaURL.split('/')[0]

            console.log(`> DownloadRobot: Video scrubber_url: ${mediaURL}`)
            console.log(`> DownloadRobot: Video media ID: ${mediaID}`)

            try {
                const [resolution, video] = await getBestResolutionAndVideo()

                const buffer = (await video).body

                if (buffer) {

                    console.log(`> DownloadRobot: Video downloaded with the best available resolution.`)

                    const fileName = `${mediaID}_${resolution}p.mp4`
                    const filePath = join(state.searchRedditPage, fileName)

                    if (!existsSync(state.searchRedditPage)) {
                        mkdirSync(state.searchRedditPage)
                        console.log(`Folder ${state.searchRedditPage} has been created.`)
                    } 

                    writeFileSync(filePath, buffer)
                    console.log(`> DownloadRobot: Video ${fileName} has been successfully downloaded!`)

                    return tryToDownloadAudio(mediaID)
                }
                else console.log(`> DownloadRobot: ${mediaID} does not has a buffer.`)

            } catch (error) {
                return console.log(`> DownloadRobot: ${mediaID} Could not find any available resolution.`)
            }

            async function getBestResolutionAndVideo() {
                const resolutionsAndVideos = resolutions.map(createResolutionsURLs)
                const bestOne = await asyncFind(resolutionsAndVideos, findBestPossibleResolution)
                return bestOne
            }

            function createResolutionsURLs(resolution) {
                console.log(`> DownloadRobot: Saving the video ${mediaID} with the resolution ${resolution}`)
                return [resolution, superagent.get(`${baseURL}${mediaID}/DASH_${resolution}.mp4`)]
            }

            async function asyncFind(resolutionsAndVideos, func) {
                for (let resolutionIndex = 0; resolutionIndex < resolutionsAndVideos.length; resolutionIndex++) {
                    const testVideo = await func(resolutionsAndVideos[resolutionIndex])
                    if (testVideo) return resolutionsAndVideos[resolutionIndex]
                }
                return null
            }

            async function findBestPossibleResolution([resolution, video]) {
                const result = await video.then(() => true).catch(() => false)
                result ? console.log(`> DownloadRobot: ${resolution} is available, going to download it.`) : console.log(`> DownloadRobot: ${resolution} is not available.`)
                return result
            }
        }

        async function tryToDownloadAudio(mediaID) {
            try {
                const audio = await superagent.get(`${baseURL}${mediaID}/DASH_audio.mp4`)
                const fileName = `${mediaID}.mp3`
                const filePath = join(state.searchRedditPage, fileName)

                writeFileSync(filePath, audio.body)
                console.log(`> DownloadRobot: Audio ${fileName} has been successfully downloaded! `)
            } catch (error) {
                console.log(`Audio not found for this video.`)
            }

        }

    }
}


module.exports = robot