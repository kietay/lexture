import Course from '../models/Course'
import Caption from '../models/Caption'
import Video from '../models/Video'

export const searchTranscripts = async query => {
  const res = await Caption.find({ $text: { $search: query } }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(20)
    .exec()

  const videoDetailsFetched = res.map(async r => {
    const vid = await fetchVideoFromId(r.videoId)
    const course = await fetchCourseFromVideoId(r.videoId)

    const tags = vid.topics.map(x => ({ tag: x }))

    return {
      courseTitle: course.title,
      videoId: vid.videoId,
      videoTitle: vid.title,
      instructor: vid.instructor,
      tags: tags,
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

export const fetchVideoFromId = videoId => {
  return Video.findOne({ videoId: videoId }).exec()
}

export const writeCaption = caption => {
  const cap = new Caption(caption)
  cap.save(err => {
    if (err) console.log(err)
  })
}

export const fetchCourseFromVideoId = videoId =>
  Course.findOne({
    videos: videoId,
  })
