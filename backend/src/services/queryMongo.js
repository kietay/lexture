import Course from '../models/Course'

const searchTranscripts = query =>
  Course.find({ $text: { $search: query } })
    .limit(20)
    .exec()
