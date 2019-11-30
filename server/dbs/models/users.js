import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  nickname: {
    type: String,
    unique: true,
    require: true
  },
  pass: {
    type: String,
    require: true
  },
  signup: {
    type: String,
    require: true
  },
  occupation: {
    type: String,
    default: ''
  },
  province: {
    type: Object,
    default: {
      code: '11',
      name: '北京市'
    }
  },
  city: {
    type: Object,
    default: {
      code: '1101',
      name: '市辖区',
      pcode: '11'
    }
  },
  date: {
    type: Date,
    require: true,
    default: Date.now
  },
  hobby: {
    type: Array,
    default: ['跑步', '听音乐', '羽毛球']
  }
})

userSchema.index({ nickname: 1 })

export default mongoose.model('Users', userSchema)