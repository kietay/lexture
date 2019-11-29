import express from 'express'
const router = express.Router()
import { searchTranscripts } from '../services/mongo'

router.get('/', async (req, res) => {
  const videos = await searchTranscripts(req.query.searchq)

  res.render('search-temp', {
    textQuery: req.query.searchq,
    searchResults: videos,
  })
})

export default router
