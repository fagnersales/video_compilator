const downloadVideoFromPost = require('./downloadVideoFromPost')

async function robot(state) {
    console.log(`> DownloadRobot: Downloading videos from URL`)

    for (const post of state.redditData.slice(0, state.videoAmount)) {
        console.log(`> DownloadRobot: Trying to download the video from the post: ${post.permalink}`)
        await downloadVideoFromPost({ post, state })
    }

}

module.exports = robot
