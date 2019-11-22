import aws from 'aws-sdk'

const spacesEndpoint = new aws.Endpoint('nyc3.digitaloceanspaces.com')
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
})

const uploadDir = (courseId, fileName, customName) => {
  const uploadName = customName ? customName : fileName
  return `content/${courseId}/videos/${uploadName}`
}

const upload = uploadPath =>
  multer({
    storage: multerS3({
      s3: s3,
      bucket: 'lexture',
      acl: 'public-read',
      key: (request, file, cb) => {
        console.log(file)
        cb(null, uploadPath)
      },
    }),
  }).array('upload', 1)
