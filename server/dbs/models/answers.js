import mongoose from 'mongoose'

const answersSchema = new mongoose.Schema({
  nickname: {
    require: true,
    type: String
  },
  qid: {
    require: true,
    type: String
  },
  answer: {
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

answersSchema.index({ nickname: 1, qid: 1 })

export default mongoose.model('Answers', answersSchema)