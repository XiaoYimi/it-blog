import mongoose from 'mongoose'

const contactsSchema = new mongoose.Schema({
  nickname: {
    require: true,
    type: String,
    unique: true
  },
  qq: {
    type: String,
    default: ''
  },
  wechat: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  weibo: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  }
})

contactsSchema.index({ nickname: 1 })

export default mongoose.model('Contacts', contactsSchema)