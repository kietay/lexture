import aws from 'aws-sdk'
import uuid from 'uuid'
import fs from 'fs'

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com')
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
})

export const courseUploadDir = courseId => {
  const uploadName = uuid.v4() + '.mp4'
  return `content/${courseId}/videos/${uploadName}`
}

export const tempDir = 'temp/videos'

export const uploadToBucket = fp => uploadPath => {
  const file = fs.createReadStream(fp)
  file.on('error', err => console.log(err))
  const uploadParams = { Bucket: 'lexture', Key: uploadPath, Body: file }

  s3.upload(uploadParams)
    .promise()
    .then(x => console.log('Upload success!'))
}

export const upp = fp => ({ to: toBucket(fp) })

const toBucket = fp => uploadPath => {
  const file = fs.createReadStream(fp)
  file.on('error', err => console.log(err))
  const uploadParams = { Bucket: 'lexture', Key: uploadPath, Body: file }

  s3.upload(uploadParams)
    .promise()
    .then(x => console.log('Upload success!'))
}
