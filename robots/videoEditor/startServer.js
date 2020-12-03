const express = require('express')
const app = express()
const PORT = 3333

const fs = require('fs')
const path = require('path')

async function startServer() {
    console.log(`> videoEditorRobot: Starting Server...`)

    app.use(express.static(path.join(__dirname, "/page")))
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))

    app.get('/', (_req, res) => {
        const header = generateHeader()
        const script = generateScripts()
        const videosCards = generateVideosCards()
        const novoModal = generateNovoModal()

        res.send(HTMLFy(
            header,
            script,
            videosCards,
            novoModal
        ))
    })


    app.post('/edit', (req, res) => {

        const { archive, toname } = req.body

        if (!archive || !toname) return res.send('StatusCode: 666')

        const oldPath = path.join(__dirname, 'page/videos', archive)

        const newPath = path.join(__dirname, 'page/videos', toname)

        const videos = fs
            .readdirSync(path.join(__dirname, 'page/videos'))
            .filter(video => !['deleted', 'saved'].includes(video))

        const indexOf = videos.indexOf(archive)

        const nextVideo = videos[(indexOf >= 0 ? indexOf : -2) + 1]

        fs.rename(oldPath, newPath, error => {
            if (error) {
                res.send(`Arquivo não encontrado!`)
                setTimeout(() => res.redirect('/'), 2000)
            } else {
                res.redirect(nextVideo ? `/#${nextVideo}` : '/')
            }
        })
    })

    const listener = app.listen(PORT, () => {
        console.log(`> videoEditorRobot: Started and listening on port: ${PORT}`)
        console.log(`> videoEditorRobot: http://localhost:` + PORT)
    })
    return new Promise(resolve => {
        app.get('/finish', (_req, res) => {
            res.send(`<h1> > videoEditorRobot: Close this window.</h1>`)
            console.log(`> videoEditorRobot: Server closed, running the code.`)
            resolve()
            listener.close(err => console.log(err))
        })
    })


    function generateHeader() {
        console.log(`> videoEditorRobot: Generating Header`)
        return `<head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Video Compilator</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.css">
        <link rel="stylesheet" href="style.css">
    </head>`
    }

    function generateScripts() {
        console.log(`> videoEditorRobot: Generating Script`)
        return `<script src="https://code.jquery.com/jquery-3.5.1.js" integrity="sha256-QWo7LDvxbWT2tbbQ97B53yJnYU3WhH/C8ycbRAkjPDc=" crossorigin="anonymous"></script>`
    }

    function generateVideosCards() {
        console.log(`> videoEditorRobot: Generating Video Cards `)
        const videos = fs.readdirSync(path.join(__dirname, 'page/videos'))

        const mapVideos = (video, index, arr) => {
            console.log(`> videoEditorRobot: Video Card (${index + 1}/${arr.length})`)
            return `
        <div class="card">
            <video src="videos/${video}" onclick="novoModal(this)"></video>
           ${getVideoDecorator(video)}
            <div class="nome">
                <span class="editable">${video}</span>
            </div>
        </div>`
        }

        return `<div class="cards">` + videos.map(mapVideos).join('') + `</div> <a href="/finish" class="finish">Terminar</a>`

        function getVideoDecorator(video) {
            console.log(`> videoEditorRobot: Getting video decorator`)
            if (video.includes('deleted')) {
                return `<div class="decorator fa fa-times" id="deletedVideos"></div>`
            } else if (video.includes('saved')) {
                return `<div class="decorator fa fa-heart" id="savedVideos"></div>`
            } else {
                return `<div></div>`
            }
        }
    }

    function generateNovoModal() {
        console.log(`> videoEditorRobot: Generating Novo Modal`)
        return `<script>
            $(window).ready(function(){
                if (window.location.hash) novoModal(window.location.hash.slice(1))
            })

            function novoModal(videoData) {
                const videoNameRaw = typeof videoData === 'string' ? 
                videoData : $(videoData).attr('src').split('/')[1]

                const videoName = videoNameRaw.split('.')[0]
                 
                const videoSrc = $(videoData).attr('src') || 'videos/' + videoNameRaw

                if ($('.modal')) $('.modal').remove() & $('body').removeClass('modal-abriu')
                $('body').addClass('modal-abriu')

                $('body').append(\`
                <div class="modal">
                    
                    <form action="/edit" method="POST">
                        <input type="hidden" value="\${videoNameRaw}" name="archive">
                        <input type="hidden" value="\${videoName + '-deleted.mp4'}" name="toname">
                        <button class="fas fa-times" id="deleter"></button>
                    </form>
                    
                    <video src="\${videoSrc}" controls></video>

                    <form action="/edit" method="POST">
                        <input type="hidden" value="\${videoNameRaw}" name="archive">
                        <input type="hidden" value="\${videoName}-saved.mp4" name="toname">
                        <button class="fas fa-heart" id="saver"></button>
                    </form>
                </div>
                \`)
                
            }

            $('.iconPointer').on('click', function(){
                $(this).parent().toggleClass('active')
            })
            $('.iconPointer').on('blur', function(){
                $(this).parent().removeClass('active')
            })
            $('body.modal-abriu').on('click', function(){
                console.log('asd')
            })

        </script>`
    }

    function HTMLFy(...args) {
        return args.map(arg => arg).join('')
    }

}

module.exports = startServer