import express from 'express'
const router = express.Router()
import multer from 'multer'
import multers3 from 'multer-s3'
import { videoFilter } from '../utils/filters'
import path from 'path'
import uuid from 'uuid'
import spaces from '../services/spaces'
import {
  convertVid,
  transcribeAudio,
  transcriptionToDataModel,
  transcriptionToVtt,
} from '../services/gcp'
import Video from '../models/Video'
import Caption from '../models/Caption'
import fs from 'fs'
import Course from '../models/Course'

const fsp = fs.promises

router.get('/', (req, res) => {
  res.render('upload')
})

const localUpload = multer({
  storage: multer.diskStorage({
    destination: './temp/videos',
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1]
      const fileName = `${uuid.v4()}.${ext}`
      cb(null, fileName)
    },
    fileFilter: videoFilter,
  }),
})

router.post('/new-video', (req, res) => {
  localUpload.single('video')(req, res, err => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError)
    } else if (!req.file) {
      return res.send('Please select a video to upload')
    } else if (err instanceof multer.MulterError) {
      return res.send(err)
    } else if (err) {
      return res.send(err)
    }

    console.debug(`File uploaded ${JSON.stringify(req.file)}`)

    res.redirect('/uploadinfo?uploadId=' + req.file.filename)
  })
})

router.get('/upload-info', (req, res) => {
  res.send(req)
})

router.get('/video-details', (req, res) => {
  res.send(req)
})

router.post('/submit-video-details', async (req, res) => {
  const videoId = uuid.v4()

  const filePath = __dirname + '/../../temp/videos/' + req.body.uploadId
  const spacesName = await spaces.upload(filePath).to(spaces.courseDir('exampleCourse'))

  const spacesPrefix = 'https://lexture.nyc3.digitaloceanspaces.com/'

  const audioPath = await convertVid(filePath)
  console.log('Video converted, transcribing audio')
  const transRes = await transcribeAudio(path.normalize(audioPath))

  const transDm = transcriptionToDataModel(transRes, videoId)
  const transVtt = transcriptionToVtt(transRes)

  const transPath = 'temp/transcripts/' + videoId

  await fsp.writeFile(transPath, transVtt, err => {
    if (err) console.log(err)
  })

  const transcriptSpacesPath = await spaces
    .upload(transPath)
    .to(spaces.transcriptDir('exampleCourse'))

  // fsp.unlink(transPath)
  fsp.unlink(filePath)
  fsp.unlink(path.normalize(audioPath))

  // todo include video length

  const data = {
    videoId: videoId,
    url: spacesPrefix + spacesName,
    title: req.body.title,
    topics: req.body.tags,
    course: req.body.course,
    instructor: req.body.lecturer,
    captions: [
      {
        language: 'en',
        // url: transcriptSpacesPath,
        url: transPath,
      },
    ],
  }

  const vid = new Video(data)

  vid.save().catch(err => console.log(err))

  console.log(`Finding course: ${req.body.course}`)
  const course = await Course.findOne({ courseId: req.body.course })
  course.videoIds.push(videoId)
  course.save()

  transDm.forEach(c => new Caption(c).save().catch(err => console.log(err)))
})

export default router
