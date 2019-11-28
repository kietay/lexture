import express from 'express'
const router = express.Router()
import uuid from 'uuid'
import formidable from 'formidable'
import multer from 'multer'
import multerS3 from 'multer-s3'
import { videoFilter } from '../utils/filters'
import path from 'path'

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/../views/upload.html'))
})

router.post('/upload-new-video', (req, res) => {
  let upload = multer({ storage: storage, fileFilter: helpers.imageFilter }).single('new_video')

  upload(req, res, err => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError)
    } else if (!req.file) {
      return res.send('Please select a video to upload')
    } else if (err instanceof multer.MulterError) {
      return res.send(err)
    } else if (err) {
      return res.send(err)
    }

    res.redirect('/')
  })
})

export default router
