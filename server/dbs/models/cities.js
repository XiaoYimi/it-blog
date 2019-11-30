import mongoose from 'mongoose'

const citiesSchema = new mongoose.Schema({
  code: {
    require: true,
    type: String
  },
  name: {
    require: true,
    type: String
  },
  pcode: {
    require: true,
    type: String
  } 
})

citiesSchema.index({ pcode: 1 })

export default mongoose.model('Cities', citiesSchema)