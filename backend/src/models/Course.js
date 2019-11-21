import mongoose from 'mongoose'
import languages from './Enums/languages'

const Captions = new mongoose.Schema({
  text: String,
  startTimestamp: String,
  endTimestamp: String,
})

const Video = new mongoose.Schema({
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
      languageCode: String,
      captionsText: [Captions],
    },
  ],
  length: {
    type: String,
    required: false,
  },
  languages: {
    type: String,
    enum: languages,
  },
})

const Course = new mongoose.Schema({
  courseId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  instructor: {
    type: String,
    required: false,
  },
  semester: {
    type: String,
    required: false,
  },
  videos: [Video],
})

export default Course
