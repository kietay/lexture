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

    return {
      videoId: vid.videoId,
      videoTitle: vid.title,
      textMention: r.text,
      startTimestamp: r.startTimestamp,
      endTimestamp: r.endTimestamp,
    }
  })

  return await Promise.all(videoDetailsFetched)
}

export const fetchVideoFromId = videoId => {
  console.log(`Looking for ${videoId}`)
  return Video.findOne({ videoId: videoId }).exec()
}

export const writeCaption = caption => {
  const cap = new Caption(caption)
  cap.save(function(err) {
    if (err) console.log(err)
  })
}

export const fetchCourseFromVideoId = videoId =>
  Course.findOne({
    videos: videoId,
  })
