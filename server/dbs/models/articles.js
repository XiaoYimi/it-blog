import mongoose from 'mongoose'

const articlesSchema = new mongoose.Schema({
  aid: {
    type: String,
    require: true
  },
  nickname: {
    require: true,
    type: String
  },
  group: {
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
  date: {
    type: Date,
    default: Date.now
  },
  reading: {
    type: Number,
    default: 0
  }
})

articlesSchema.index({ nickname: 1 })
articlesSchema.index({ nickname: 1, group: 1 })
articlesSchema.index({ title: 1 })

export default mongoose.model('Articles', articlesSchema)