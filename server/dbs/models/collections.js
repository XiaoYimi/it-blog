import mongoose from 'mongoose'

const collectionsSchma = new mongoose.Schema({
  nickname: {
    require: true,
    type: String
  },
  list: {
    type: Array,
    default: []
  }
})

collectionsSchma.index({ nickname: 1 })

export default mongoose.model('Collections', collectionsSchma)