import mongoose from 'mongoose'

const course = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  instructor: {
    type: String,
    required: false,
  },
  semester: {
    type: String,
    required: false,
  },
  videoIds: [String],
})

course.index({ videoIds: 1 })

export default mongoose.model('Course', course)
