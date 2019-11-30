import mongoose from 'mongoose'

const problemsSchema = new mongoose.Schema({
  qid: {
    type: String,
    require: true
  },
  nickname: {
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

problemsSchema.index({ nickname: 1 })

export default mongoose.model('Problems', problemsSchema)