const addAudioToVideos = require('./addAudioToVideos')
const moveAndRenameFiles = require('./moveAndRenameFiles')
const startServer = require('./startServer')
const deleteUnsavedFiles = require('./deleteUnsavedFiles')
const concateVideos = require('./concateVideos')

async function robot(state) {
    console.log(`> videoEditorRobot: Started!`)

    await addAudioToVideos(state)
    moveAndRenameFiles(state)
    await startServer(state)
    deleteUnsavedFiles(state)
    await concateVideos(state)
    
}

module.exports = robot