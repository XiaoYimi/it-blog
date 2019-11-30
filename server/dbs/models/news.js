import mongoose from 'mongoose'

const newsSchema = new mongoose.Schema({
  nid: {
    require: true,
    type: String
  },
  title: {
    require: true,
    type: String
  },
  content: {
    require: true,
    type: String
  },
  reading: {
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now
  }
})

newsSchema.index({ nid: 1 })

export default mongoose.model('News', newsSchema)