import aws from 'aws-sdk'
import uuid from 'uuid'
import fs from 'fs'
import multer from 'multer'
import multerS3 from 'multer-s3'

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com')
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
})

const courseUploadDir = courseId => {
  const uploadName = uuid.v4() + '.mp4'
  return `content/${courseId}/videos/${uploadName}`
}

const transcriptUploadDir = courseId => {
  const uploadName = uuid.v4() + '.vtt'
  return `content/${courseId}/transcripts/${uploadName}`
}

const tempDir = 'temp/videos'

const upload = fp => ({ to: toBucket(fp) })

const toBucket = fp => uploadPath => {
  const file = fs.createReadStream(fp)
  file.on('error', err => console.log(err))
  const uploadParams = { Bucket: 'lexture', Key: uploadPath, Body: file }

  s3.upload(uploadParams)
    .promise()
    .then(x => console.log('Upload success!'))

  return uploadPath
}

const multerUpload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'lexture',
    acl: 'public-read',
    key: function(req, file, cb) {
      console.log(file)
      cb(null, file.originalname)
    },
  }),
})

export default {
  upload: upload,
  courseDir: courseUploadDir,
  transcriptDir: transcriptUploadDir,
  multerUpload: multerUpload,
}
