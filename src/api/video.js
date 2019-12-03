import express from 'express'
const router = express.Router()
import Video from '../models/Video'
import Caption from '../models/Caption'
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

  const subs = [
    {
      lang: 'en',
      label: 'English',
      url: "/transcript?turl=" + vid.captions[0].url
    }
  ]

  const transcript = await fetchTranscriptText(vid.videoId)

  console.log(`transcript: ${JSON.stringify(transcript)}`)

  const data = {
    course: course.title,
    title: vid.title,
    videoUrl: vid.url,
    lecturer: course.instructor,
    tags: tags,
    languages: languages,
    textSearchResults: snippets,
    subtitleTracks: subs,
    transcriptText: transcript,
  }

  res.render('video', data)
})

const fetchTranscriptText = async videoId => {
  const captions = await Caption.find({videoId: videoId}).sort({startTimestamp: 1})

  console.log(`Captions: ${JSON.stringify(captions)}`)

  return captions.map(x => ({
    text: x.text,
    timestamp: secondsToColonTime(x.startTimestamp)
  }))
}

// downloadTranscript("content/exampleCourse/transcripts/6633efce-5e46-416a-ac02-e155d3f65728.vtt").then(data => console.log(data))

export default router
