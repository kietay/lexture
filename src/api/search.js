import express from 'express'
const router = express.Router()
import Course from '../models/Course'
import Caption from '../models/Caption'
import Video from '../models/Video'

router.get('/', async (req, res) => {
  const videos = await searchTranscripts(req.query.searchq)

  res.render('search-results', {
    textQuery: req.query.searchq,
    searchResults: videos,
  })
})

export const searchTranscripts = async query => {
  const res = await Caption.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)

  const videoDetailsFetched = res.map(async r => {
    console.log(`Finding video details: ${r.videoId}`)
    const vid = await fetchVideoFromId(r.videoId)

    console.log('Finding course details...')
    const course = await fetchCourseFromVideoId(r.videoId)

    const tags = vid.topics.map(x => ({ tag: x }))

    return {
      courseTitle: course.title,
      videoId: vid.videoId,
      videoTitle: vid.title,
      // todo this should be fixed to take from course
      courseInstructor: vid.instructor,
      tags: tags,
      videoLength: String(vid.lengthSeconds),
      textMention: r.text,
      textMatches: [
        {
          text: r.text,
          timestamp: r.startTimestamp,
        },
      ],
      startTimestamp: r.startTimestamp,
      endTimestamp: r.endTimestamp,
    }
  })

  return await Promise.all(videoDetailsFetched)
}

export const fetchVideoFromId = videoId => Video.findOne({ videoId: videoId }).exec()

export const fetchCourseFromVideoId = videoId =>
  Course.findOne({
    videoIds: videoId,
  }).exec()

export const fetchVideoMatchingTranscripts = (videoId, query) =>
  Caption.find({ $text: { $search: query }, videoId: videoId }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(10)

export const transcriptsToSnippet = (xscripts, searchTerm) =>
  // todo fix this - this is horrendous, just for formatting the query strings
  xscripts.map(x => {
    const txt = x.text
    const ind = txt.toLowerCase().indexOf(searchTerm.toLowerCase())
    if (ind == -1) return xscripts.substring(0, 50)

    const startInd = ind > 24 ? ind - 25 : 0
    const wordEndInd = ind + searchTerm.length
    const highlightWord = txt.substring(ind, wordEndInd)

    const endInd = ind > 24 ? ind + 25 : 50

    const startTag = ind > 25 ? '...' : ''
    const endTag = txt.length > 50 ? '...' : ''

    console.log(`Inds: ${startInd}, ${endInd}`)

    return (
      startTag +
      txt.substring(startInd, ind) +
      `<span class="search-term-highlight">` +
      highlightWord +
      '</span>' +
      txt.substring(wordEndInd, endInd) +
      endTag
    )
  })

export default router
