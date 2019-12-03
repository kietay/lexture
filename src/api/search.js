import express from 'express'
const router = express.Router()
import Course from '../models/Course'
import Caption from '../models/Caption'
import Video from '../models/Video'

router.get('/', async (req, res) => {
  const videos = await searchTranscripts(req.query.searchq)

  const lecturers = getAllUniqueLecturer(videos)
  console.log(`Unique lecturers: ${JSON.stringify(lecturers)}`)

  res.render('search-results', {
    searchTerm: req.query.searchq,
    searchResultEntries: videos,
    resultCount: videos.length,
    filterTypes: {
      lecturers: getAllUniqueLecturer(videos),
      // todo fix hardcoding
      times: [{range: "< 10 mins"}, {range:"10-60 mins"}, {range:"> 1 hr"}],
      transcripts: [{language: "en"}]
    }
  })
})

const getAllUniqueLecturer = (videos) => {
  let lecturers = []
  videos.forEach(vid => {
    if (!lecturers.includes(vid.lecturer)) lecturers.push({name: vid.lecturer, lecturerTag: vid.lecturer.split(" ").join("_")})
  })
  return lecturers
}

const aggregateTranscripts = ( query, limit ) =>
  Caption.aggregate([
    {
      "$match": { "$text": { "$search": query } },
    },
    {
      "$group": {
        _id: '$videoId',
        videoId: { "$first": "$videoId" },
        textMatches: {
          "$push": {
            text: "$text",
            startTimestamp: "$startTimestamp",
            endTimestamp: "$endTimestamp",
          },
        },
        text: { "$addToSet": "$text" },
      },
    },
  ]).limit(limit)

export const searchTranscripts = async query => {

  const res = await aggregateTranscripts(query, 20)

  if (res.length == 0) return []

  let vidId = 0

  const videoDetailsFetched = res.map(async r => {
    vidId += 1
    console.log(`Finding video details: ${r.videoId}`)
    const vid = await fetchVideoFromId(r.videoId)

    // todo possible remove this?
    // const course = await fetchCourseFromVideoId(r.videoId)

    const topics = vid.topics.map(x => ({ tag: x }))

    let textId = 1

    const textMatches = r.textMatches.map(x => {
      textId += 1
      return {
      id: vidId,
      iid: textId,
      snippet: transcriptToSnippet(x, query),
      timestamp: secondsToColonTime(x.startTimestamp),
      timeParam: x.startTimestamp,
      videoId: r.videoId
    }})

    console.log('Text matches:')
    console.log(JSON.stringify(textMatches))

    console.log('Returning search results')

    return {
      videoId: vid.videoId,
      id: vidId,
      title: vid.title,
      // todo this should be fixed to take from course
      lecturer: vid.instructor,
      lecturerTag: vid.instructor.split(" ").join("_"),
      topics: topics,
      // todo fix this hardcoding
      time: "10 mins",
      transcriptSearchResults: textMatches,
    }
  })

  return await Promise.all(videoDetailsFetched)
}

export const fetchVideoFromId = videoId => Video.findOne({ videoId: videoId }).exec()

export const fetchCourseFromVideoId = videoId =>
  Course.findOne({
    videoIds: videoId,
  }).exec()

  // this should maybe do in time order
export const fetchVideoMatchingTranscripts = (videoId, query) =>
  Caption.find({ $text: { $search: query }, videoId: videoId }, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(10)

export const transcriptToSnippet = (x, searchTerm) => {
  // todo fix this - this is horrendous, just for formatting the query strings
    const txt = x.text
    console.log(`Txt: ${txt}`)
    console.log(`Search term: ${searchTerm}`)
    const ind = txt.toLowerCase().indexOf(searchTerm.toLowerCase())
    if (ind == -1) return `...${txt.substring(0, 30)}...`

    const startInd = ind > 14 ? ind - 15 : 0
    const wordEndInd = ind + searchTerm.length
    const highlightWord = txt.substring(ind, wordEndInd)

    const endInd = ind > 14 ? ind + 15 : 30

    const startTag = ind > 15 ? '...' : ''
    const endTag = txt.length > 30 ? '...' : ''

    return (
      startTag +
      txt.substring(startInd, ind) +
      // todo fix this to render the html tag
      `<span class="search-term-highlight">` +
      // "*" +
      highlightWord +
      // "*" +
      '</span>' +
      txt.substring(wordEndInd, endInd) +
      endTag
    )
  }

export const secondsToTimeString = (seconds) =>
  { // day, h, m and s
    var days     = Math.floor(seconds / (24*60*60));
        seconds -= days    * (24*60*60);
    var hours    = Math.floor(seconds / (60*60));
        seconds -= hours   * (60*60);
    var minutes  = Math.floor(seconds / (60));
        seconds -= minutes * (60);
    return ((0<days)?(days+" day, "):"")+((hours > 0)?(hours+"h, "):"")+minutes+"m, "+seconds+"s";
  }

Number.prototype.pad = function(size) {
  let s = String(this);
  while (s.length < (size)) {s = "0" + s;}
  return s
}

export const secondsToColonTime = seconds => {
  const secs = seconds % 60
  const mins = Math.floor(seconds / 60)

  return `${mins.pad(2)}:${secs.pad(2)}`
}

export default router
