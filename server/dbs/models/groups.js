import mongoose from 'mongoose'

const groupsSchma = new mongoose.Schema({
  nickname: {
    require: true,
    type: String
  },
  list: [{
    name: {
      type: String,
      require: true
    },
    count: {
      type: Number,
      default: 0
    }
  }]
})

groupsSchma.index({ nickname: 1 })

export default mongoose.model('Groups', groupsSchma)