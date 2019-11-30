import mongoose from 'mongoose'

const provincesSchema = new mongoose.Schema({
  code: String,
  name: String
})

provincesSchema.index({ code: 1 })

export default mongoose.model('Provinces', provincesSchema)