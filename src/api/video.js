import express from 'express'
const router = express.Router()
import Video from '../models/Video'
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

  const data = {
    course: course.title,
    title: vid.title,
    videoUrl: vid.url,
    lecturer: course.instructor,
    tags: tags,
    languages: languages,
    textSearchResults: snippets,
  }

  res.render('video', data)
})

// downloadTranscript("content/exampleCourse/transcripts/f8087006-ba4b-457e-90c4-1c1b1f473487.vtt").then(data => console.log(data))

export default router
