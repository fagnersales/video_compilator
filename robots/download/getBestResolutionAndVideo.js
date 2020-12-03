const superagent = require('superagent')

async function getBestResolutionAndVideo({ resolutions, mediaID, baseURL }) {

    const resolutionsAndVideos = resolutions.map(resolution => createResolutionsURLs({ resolution, mediaID, baseURL }))

    const bestOne = await asyncFind(resolutionsAndVideos, findBestPossibleResolution)
    return bestOne
}

function createResolutionsURLs({ resolution, mediaID, baseURL }) {
    console.log(`> DownloadRobot: Saving the video ${mediaID} with the resolution ${resolution}`)
    return [resolution, superagent.get(`${baseURL}${mediaID}/DASH_${resolution}.mp4`)]
}

function findBestPossibleResolution([resolution, video]) {
    const result = await video.then(() => true).catch(() => false)
    result
        ? console.log(`> DownloadRobot: ${resolution} is available, going to download it.`)
        : console.log(`> DownloadRobot: ${resolution} is not available.`)
    return result
}

async function asyncFind(resolutionsAndVideos, func) {
    for (let resolutionIndex = 0; resolutionIndex < resolutionsAndVideos.length; resolutionIndex++) {
        const testVideo = await func(resolutionsAndVideos[resolutionIndex])
        if (testVideo) return resolutionsAndVideos[resolutionIndex]
    }
    return null
}

module.exports = getBestResolutionAndVideo