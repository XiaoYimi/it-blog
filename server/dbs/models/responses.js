import mongoose from 'mongoose'

const responsesSchema = new mongoose.Schema({
  nickname: {
    require: true,
    type: String
  },
  title: String,
  respondent: String,
  towho: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
})


responsesSchema.index({ title: 1, towho: 1 })

export default mongoose.model('Responses', responsesSchema)