import mongoose from 'mongoose'

const caption = new mongoose.Schema({
  videoId: String,
  text: String,
  startTimestamp: String,
  endTimestamp: String,
})

caption.index({ text: 'text' })

export default mongoose.model('Caption', caption)
