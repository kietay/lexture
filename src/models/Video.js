import mongoose from 'mongoose'
import { languages } from './Enums'

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
      language: { type: String, enums: languages },
      url: String,
    },
  ],
  lengthSeconds: {
    type: Number,
    required: false,
  },
  instructor: {
    type: String,
    required: false,
  },
})

export default mongoose.model('Video', video)
