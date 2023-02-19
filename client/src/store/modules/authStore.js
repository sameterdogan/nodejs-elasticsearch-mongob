import router from '@/router'
import axios from 'axios'

const authStore = {
  state: {
    token: null,
    user: null,
    loginError: null,
  },
  mutations: {
    INIT_TOKEN(state, token) {
      state.token = token
    },
    INIT_USER(state, user) {
      state.user = user
    },
    SET_LOGIN_ERROR(state, message) {
      state.loginError = message
    },
    LOGOUT(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      window.location = '/'
    },
  },
  actions: {
    login({ commit, dispatch }, user) {
      axios.post('auth/login', user)
        .then(res => {
          if (res.data.success) {
            dispatch('attempt', res.data.token)
          } else {
            commit('SET_LOGIN_ERROR', res.data.message)
          }
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    async attempt({ commit, state }, token) {
      if (token) commit('INIT_TOKEN', token)
      if (!state.token) return
      try {
        const res = await axios.get('auth/me')
        commit('INIT_USER', res.data)
        router.push({ name: 'create-blog' })
      } catch (err) {
        commit('INIT_USER', null)
        commit('INIT_TOKEN', null)
        console.log('failed')
      }
    },
    logout({ commit }) {
      commit('LOGOUT')
      /*  commit('INIT_TOKEN', null)
              commit('INIT_USER', null) */
    },
  },
  getters: {
    authenticated(state) {
      return state.token && state.user
    },
    getUser(state) {
      return state.user
    },
    getLoginError: state => state.loginError,
  },
}

export default authStore
