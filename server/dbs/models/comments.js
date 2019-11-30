import mongoose from 'mongoose'

const commentsSchema = new mongoose.Schema({
  aid: {
    require: true,
    type: String
  },
  nickname: {
    require: true,
    type: String
  },
  title: {
    require: true,
    type: String
  },
  commenter: {
    require: true,
    type: String
  },
  towho: {
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
  }
})

commentsSchema.index({ title: 1, nickname: 1 })
commentsSchema.index({ title: 1, towho: 1 })

export default mongoose.model('Comments', commentsSchema)