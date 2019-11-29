import express from 'express'
const router = express.Router()
import Course from '../models/Course'
import Caption from '../models/Caption'
import Video from '../models/Video'

router.get('/', async (req, res) => {
  const videos = await searchTranscripts(req.query.searchq)

  res.render('search-temp', {
    textQuery: req.query.searchq,
    searchResults: videos,
  })
})

export const searchTranscripts = async query => {
  const res = await Caption.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)

  const videoDetailsFetched = res.map(async r => {
    const vid = await fetchVideoFromId(r.videoId)
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

export const fetchVideoFromId = videoId => Video.findOne({ videoId: videoId })

export const fetchCourseFromVideoId = videoId =>
  Course.findOne({
    videos: videoId,
  })

export default router
