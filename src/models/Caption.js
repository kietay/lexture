import mongoose from 'mongoose'

const caption = new mongoose.Schema({
  videoId: String,
  text: String,
  // todo change the timestamp names to indicate they are second markers
  startTimestamp: Number,
  endTimestamp: Number,
})

caption.index({ text: 'text' })

export default mongoose.model('Caption', caption)
