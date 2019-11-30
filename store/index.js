export const state = () => ({
  user: {
    nickname: '',
    signup: '',
    occupation: '',
    province: {
      code: '00',
      name: '未知'
    },
    city: {
      code: '00',
      name: '未知'
    },
    hobby: [],
    date: '',
    contacts: {
      qq: '',
      weibo: '',
      wechat: '',
      email: '',
      phone: ''
    },
    groups: []
  }
})

export const mutations = {

  getUser (state, user) {
    state.user = user
  },
  updateContacts (state, contacts) {
    state.user.contacts = contacts
  },
  updatePositions (state, positions) {
    state.user.province = positions.province
    state.user.city = positions.city
  },
  updateCity (state, { city }) {
    state.user.city = city
  },
  deleteTag (state, { tag }) {
    const tags = state.user.hobby.filter(item => { return item !== tag })
    state.user.hobby = tags
  },
  createTag (state, { hobby }) {
    state.user.hobby = hobby
  },
  createGroup (state, { groups }) {
    state.user.groups = groups
  },
  deleteGroup (state, { groups }) {
    state.user.groups = groups
  },
  deleteArticle (state, { groups }) {
    state.user.groups = groups
  },
  clearUser (state) {
    state.user = {
      nickname: '',
      signup: '',
      occupation: '',
      province: {
        code: '00',
        name: '未知'
      },
      city: {
        code: '00',
        name: '未知'
      },
      hobby: [],
      date: '',
      contacts: {
        qq: '',
        weibo: '',
        wechat: '',
        email: '',
        phone: ''
      },
      groups: []
    }
  }
}

export const actions = {
  updateContacts ({ commit }, contacts) {
    commit('updateContacts', contacts)
  },
  updatePositions ({ commit }, positions) {
    commit('updatePositions', positions)
  },
  deleteTag ({ commit }, { tag }) {
    commit('deleteTag', { tag })
  },
  createTag ({ commit }, { hobby }) {
    commit('createTag', { hobby })
  },
  updateCity ({ commit }, { city }) {
    commit('updateCity', { city })
  },
  createGroup ({ commit }, { groups }) {
    commit('createGroup', { groups })
  },
  deleteGroup ({ commit }, { groups }) {
    commit('deleteGroup', { groups })
  },
  deleteArticle ({ commit }, { groups }) {
    commit('deleteArticle', { groups })
  }
}
