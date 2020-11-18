const superagent = require('superagent')

const { writeFileSync } = require('fs')
const { post } = require('superagent')

async function robot(state) {
    await fetchRedditPage(state)

    async function fetchRedditPage(state) {

        const rawFetchedRedditData = await fetchReddit()
        const transformedRedditData = transformRedditData(rawFetchedRedditData)
        state.redditData = transformedRedditData


        // const url = (data.data.children[0].data['media']['reddit_video']['scrubber_media_url'])

        // superagent.get(url)
        // .then(data => writeFileSync(url.split('/').reverse()[0], data.body))

        async function fetchReddit() {

            const BaseURL = 'https://www.reddit.com'

            const URLToFetch = `${BaseURL}/r/${state.searchRedditPage}/hot.json`

            const data = await superagent.get(URLToFetch)
                .set('accept', 'json')
            return JSON.parse(data.text || '{}')
        }

        function transformRedditData(rawFetchedData) {
            const posts = rawFetchedData['data']['children']

            const filteredPosts = filterPosts(posts)
            const sorteredPosts = sortPosts(filteredPosts)
            const transformedData = getImportantRedditPostProperties(sorteredPosts)
            const dataWithVideoURLs = getVideoURLs(transformedData)
            return dataWithVideoURLs

            function filterPosts(posts) {
                return posts.filter(post => {
                    const {
                        is_video,
                        over_18,
                        removedBy,
                        media,
                        subreddit_type } = post.data

                    return is_video
                        && !!!over_18
                        && !!!removedBy
                        && !!media
                        && subreddit_type === 'public'
                })
            }

            function sortPosts(posts) {
                return posts.sort((a, b) => b.data.ups - a.data.ups)
            }

            function getImportantRedditPostProperties(posts) {
                return posts.map(post => {
                    const {
                        subreddit,
                        author_fullname,
                        title,
                        downs,
                        name,
                        upvote_ratio,
                        ups,
                        total_awards_received,
                        score,
                        subreddit_id,
                        id,
                        author,
                        permalink,
                        url,
                        media,
                        created,
                        created_utc
                    } = post.data

                    return {
                        subreddit,
                        author_fullname,
                        title,
                        downs,
                        name,
                        upvote_ratio,
                        ups,
                        total_awards_received,
                        score,
                        subreddit_id,
                        id,
                        author,
                        permalink,
                        url,
                        media,
                        created,
                        created_utc
                    }
                })
            }

            function getVideoURLs(posts) {
                return posts.map(post => {
                    const { 
                        scrubber_media_url,
                        dash_url,
                        hls_url,
                        fallback_url,
                        bitrate_kbps,
                        height,
                        width,
                        duration
                    } = post['media']['reddit_video']
                    return {
                        ...post,
                        video: {
                            urls: {
                                scrubber: scrubber_media_url,
                                dash: dash_url,
                                hls: hls_url,
                                fallback: fallback_url
                            },
                            bitrate_kbps,
                            height,
                            width,
                            duration
                        }
                    }
                })
            }
        }

    }
}

module.exports = robot