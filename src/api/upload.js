import express from 'express'
const router = express.Router()
import multer from 'multer'
import multers3 from 'multer-s3'
import { videoFilter } from '../utils/filters'
import path from 'path'
import uuid from 'uuid'
import spaces from '../services/spaces'
import Video from '../models/Video'

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../views/upload.html'))
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

router.get('/video-details', (req, res) => {
  res.send(req)
})

router.post('/test', async (req, res) => {
  const filePath = __dirname + '/../../temp/videos/' + req.body.uploadId
  const spacesName = await spaces.upload(filePath).to(spaces.courseDir('exampleCourse'))

  const spacesPrefix = 'https://lexture.nyc3.digitaloceanspaces.com/'

  const data = {
    videoId: uuid.v4(),
    url: spacesPrefix + spacesName,
    title: req.body.title,
    topics: req.body.tags,
    course: req.body.course,
    instructor: req.body.lecturer,
  }

  const vid = new Video(data)

  vid.save().catch(err => console.log(err))
})

export default router
