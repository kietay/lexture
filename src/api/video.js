import express from 'express'
const router = express.Router()
import Video from '../models/Video'
import Caption from '../models/Video'
import { fetchCourseFromVideoId, fetchVideoMatchingTranscripts, transcriptToSnippet, secondsToTimeString, secondsToColonTime } from './search'
import {downloadTranscript} from '../services/spaces'

router.get('/', async (req, res) => {
  const videoId = req.query.videoid
  const vid = await Video.findOne({ videoId: videoId })

  if (!vid) {
    res.status(404).send('VideoId not found!')
    return false
  }

  const course = await fetchCourseFromVideoId(vid.videoId)
  const transcript = downloadTranscript(vid.captions[0].url)

  const tags = vid.topics.map(x => ({ tag: x }))

  const languages = vid.captions.map(x => ({ language: x.language }))

  const searchTerm = req.query.searchq ? req.query.searchq : ''
  console.log(`Searching for ${searchTerm}`)
  const matchingTranscripts = await fetchVideoMatchingTranscripts(videoId, searchTerm)
  matchingTranscripts.forEach(x => console.log(x.text))

  const snippets = matchingTranscripts.map(x => ({
    snippet: transcriptToSnippet(x, searchTerm),
    timestamp: secondsToColonTime(x.startTimestamp)
  }))
  
  console.log("snippets:")

  const subs = [
    {
      lang: 'en',
      label: 'English',
      url: "https://lexture.nyc3.digitaloceanspaces.com/" + vid.captions[0].url
    }
  ]

  const data = {
    course: course.title,
    title: vid.title,
    videoUrl: vid.url,
    lecturer: course.instructor,
    tags: tags,
    languages: languages,
    textSearchResults: snippets,
    subtitleTracks: subs
  }

  res.render('video', data)
})

const fetchTranscript = async videoId => {
  const captions = Caption.find({videoId: videoId}).sort({})
}

// downloadTranscript("content/exampleCourse/transcripts/6633efce-5e46-416a-ac02-e155d3f65728.vtt").then(data => console.log(data))

export default router
