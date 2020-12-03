const path = require('path')
const fs = require('fs')

function moveAndRenameFiles(state) {
    console.log(`> videoEditorRobot: Moving and Renaming files`)
    
    const page = state.searchRedditPage

    const oldFilesPath = path.join(__dirname, '..', '..', page)

    const oldFiles = fs.readdirSync(oldFilesPath)

    for (const [index, oldFile] of oldFiles.entries()) {
        console.log(`> videoEditorRobot: ${oldFile} is being moved and renamed`)
        const oldFilePath = path.join(oldFilesPath, oldFile)
        const newFilePath = path.join(__dirname, 'page/videos', index + '.mp4')

        fs.renameSync(oldFilePath, newFilePath)
    }

    return console.log(`> videoEditorRobot: All files has been moved and renamed`)
}

module.exports = moveAndRenameFiles