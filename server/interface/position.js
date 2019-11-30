import Router from 'koa-router'
import ProvinceModel from '../dbs/models/provinces'
import CityModel from '../dbs/models/cities'
import UserModel from '../dbs/models/users'

let router = new Router({ prefix: '/position' })

// 获取所有省份
router.get('/provinces', async (ctx) => {
  const provinces = await ProvinceModel.find({})
  if (provinces.length > 0) {
    ctx.body = {
      code: 0,
      msg: 'request ok',
      provinces
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'not find these previnces record '
    }
  }
})

// 根据省id 获取相应城市,并设置用户位置
router.post('/cities', async (ctx) => {
  const { pcode, nickname } = ctx.request.body
  const cities = await CityModel.find({ pcode }, { _id: 0 })
  const find = await ProvinceModel.findOne({ code: pcode }, { _id: 0 })

  if (cities.length > 0) {
    if (find !== null) {
      const update = await UserModel.updateOne({ nickname }, {
        $set: { province: find, city: cities[0] }
      })
      if (update.nModified === 1) {
        ctx.body = {
          code: 0,
          msg: 'request ok, updated',
          cities,
          province: find
        }
      } else {
        ctx.body = {
          code: 1,
          msg: 'request ok, no update',
          cities,
          province: find
        }
      }
    } else {
      ctx.body = {
        code: 1,
        msg: '查询不到用户的省份'
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: 'not find these cities record '
    }
  }
})

router.post('/updateCity', async (ctx) => {
  const { code, nickname } = ctx.request.body
  const find = await CityModel.findOne({ code }, { _id: 0 })
  if (find !== null) {
    const update = await UserModel.updateOne({ nickname }, {
      $set: { city: find }
    })
    console.log(update)
    if (update.nModified === 1) {
      ctx.body = {
        code: 0,
        msg: 'request ok, updated',
        city: find
      }
    } else {
      ctx.body = {
        code: 1,
        msg: 'request ok, no update',
        city: find
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '未找到用户的城市位置'
    }
  }
})

export default router