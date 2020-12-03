const path = require('path')
const fs = require('fs')

function deleteUnsavedFiles(state){
    console.log(`> videoEditorRobot: Deleting unsaved files`)
    const filesPath = path.join(__dirname, 'page/videos')

    const files = fs
        .readdirSync(filesPath)
        .filter(file => file.includes('deleted'))

    for (const file of files) {
        console.log(`> videoEditorRobot: Unsaved file ${file} is being removed`)
        fs.unlinkSync(path.join(filesPath, file))
    }

    return console.log(`> videoEditorRobot: All unsaved files has been removed`)
}

module.exports = deleteUnsavedFiles