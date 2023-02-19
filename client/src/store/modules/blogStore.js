import router from '@/router'
import axios from 'axios'

const blogStore = {
  state: {
    blog: null,
    blogs: [],
    queryParams: {
      page: 1,
      q:""
    },
    ip: null,
  },
  mutations: {
    CLEAR_BLOGS(state) {
      state.blogs = []
      state.queryParams = { ...state.queryParams, page: 1 }
    },
    SET_BLOGS(state, blogs) {
      state.blogs = [...state.blogs, ...blogs]
    },
    ADD_BLOG(state, blog) {
      state.blogs.unshift(blog)
    },
    SET_BLOG(state, blog) {
      state.blog = blog
    },
    SET_IP(state, ip) {
      state.ip = ip
    },
    SET_BLOG_QUERY_PARAMS(state, params) {
      state.queryParams = { ...state.queryParams, ...params }
      console.log(state.queryParams)
    },
  },
  actions: {
    createBlog({ commit }, blog) {
      axios.post('/blog/create', blog)
        .then(res => {
          if (res.data.success) {
            router.push({ name: 'blogs' })
          }
        })
        .catch(err => {
          console.log(err.response)
        })
    },
    async initBlogs({ commit, state }) {
      try {
        const res = await axios.get(`/blog?page=${state.queryParams.page}&q=${state.queryParams.q}`)
        commit('SET_BLOGS', res.data.blogs.docs)
        return res
      } catch (err) {
        console.log(err)
      }
    },
    initBlog({ commit }, slug) {
      axios.get(`/blog/${slug}`)
        .then(res => {
          commit('SET_BLOG', res.data.blog)
        })
        .catch(err => {
          console.log(err.response)
        })
    },
  },
  getters: {
    getBlog: state => state.blog,
    getBlogs: state => state.blogs,
    getIp: state => state.ip,
    getBlogQueryParams: state => state.queryParams,
  },
}

export default blogStore
