import mongoose from 'mongoose'

const messagesSchema = new mongoose.Schema({
  mid: String,
  selfcontrl: {
    type: Boolean,
    default: false
  },
  from: {
    require: true,
    type: String
  },
  to: {
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
    require: true,
    type: Date,
    default: Date.now
  },
  isnew: {
    type: Boolean,
    default: true
  }
})

messagesSchema.index({ from: 1 })
messagesSchema.index({ to: 1 })

export default mongoose.model('Messages', messagesSchema)