import aws from 'aws-sdk'
import uuid from 'uuid'
import multer from 'multer'
import multerS3 from 'multer-s3'
import fs from 'fs'

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com')
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
})

export const uploadDir = courseId => {
  const uploadName = uuid.v4() + '.mp4'
  return `content/${courseId}/videos/${uploadName}`
}

export const uploadMulter = uploadPath =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: 'lexture',
      acl: 'public-read',
      key: (request, file, cb) => {
        console.log(file)
        cb(null, file.filename)
      },
    }),
  }).array('upload', 1)

export const upload = fp => uploadPath => {
  const file = fs.createReadStream(fp)
  file.on('error', err => console.log(err))
  const uploadParams = { Bucket: 'lexture', Key: uploadPath, Body: file }

  s3.upload(uploadParams)
    .promise()
    .then(x => console.log('Upload success!'))
}
