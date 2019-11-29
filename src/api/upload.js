import express from 'express'
const router = express.Router()
import multer from 'multer'
import multers3 from 'multer-s3'
import { videoFilter } from '../utils/filters'
import path from 'path'
import spaces from '../services/spaces'

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../views/upload.html'))
})

const localUpload = multer({
  storage: multer.diskStorage({
    destination: './temp/videos',
    filename: (req, file, cb) => {
      const ext = file.mimetype.split('/')[1]
      const fileName = `${file.fieldname}-${Date.now()}.${ext}`
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

    console.debug(req.file)

    const spacesName = spaces.upload(req.file.path).to(spaces.courseDir('exampleCourse'))

    res.redirect('/uploadinfo')
  })
})

router.get('/video-details', (req, res) => {
  res.send(req)
})

export default router
