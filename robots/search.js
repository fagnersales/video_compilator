const superagent = require('superagent')

async function robot(state) {
    console.log(`> SearchRobot: Started`)

    await fetchRedditPage(state)

    async function fetchRedditPage(state) {

        const rawFetchedRedditData = await fetchRedditData()
        const transformedRedditData = transformRedditData(rawFetchedRedditData)
        state.redditData = transformedRedditData

        async function fetchRedditData() {
            console.log(`> SearchRobot: Fetching Reddit Page Data`)

            const BaseURL = 'https://www.reddit.com'

            const URLToFetch = `${BaseURL}/r/${state.searchRedditPage}/hot.json`

            const data = await superagent.get(URLToFetch).set('accept', 'json')

            data ? console.log(`> SearchRobot: Fetched data from: ${URLToFetch}`) : console.log(`> SearchRobot: No such data on: ${URLToFetch}`)

            return JSON.parse(data.text || '{}')
        }

        function transformRedditData(rawFetchedData) {
            console.log(`> SearchRobot: Transforming Reddit Data`)

            const posts = rawFetchedData['data']['children']

            console.log(`> SearchRobot: Filtering ${posts.length} posts`)
            const filteredPosts = filterPosts(posts)
            console.log(`> SearchRobot: ${filteredPosts.length} posts passed the tests`)
            console.log(`> SearchRobot: Sorting posts by upvotes`)            
            const sorteredPosts = sortPosts(filteredPosts)
            console.log(`> SearchRobot: Pushing only important properties from posts`)
            const transformedData = getImportantRedditPostProperties(sorteredPosts)
            console.log(`> SearchRobot: All the data has been trasnformed`)            
            console.log(`> SearchRobot: Getting video URLs`)            
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