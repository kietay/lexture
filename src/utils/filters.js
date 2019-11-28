export const videoFilter = function(req, file, cb) {
  if (!file.originalname.match(/\.(mp4|MP4)$/)) {
    req.fileValidationError = 'Only mp4 video files are allowed!'
    return cb(new Error('Tried uploading non mp4 video file'), false)
  }
  cb(null, true)
}
