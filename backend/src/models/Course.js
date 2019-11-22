import mongoose from 'mongoose'
import languages from './Enums/languages'

const captions = new mongoose.Schema({
  text: String,
  startTimestamp: String,
  endTimestamp: String,
})

const video = new mongoose.Schema({
  videoId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  topics: [String],
  url: {
    type: String,
    required: true,
  },
  captions: [
    {
      languageCode: {
        type: String,
        enum: languages,
      },
      captionsText: [captions],
    },
  ],
  lengthSeconds: {
    type: int,
    required: false,
  },
})

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
  videos: [video],
})

course.index({ 'videos.captions.captionsText.text': 'text' })

export default mongoose.model('Course', course)
