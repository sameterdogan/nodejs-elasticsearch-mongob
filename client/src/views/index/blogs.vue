<template>
  <section class="blog-post-container container pt-3 pb-4">
    <div class="blog-header d-flex justify-content-center align-items-center flex-column pb-5">
      <h1 class="blog-header-text">
        deprem.teyitlibilgi.net
      </h1>
      <div class="d-flex justify-content-end align-items-center w-100">
        <div class="search-container">
          <input
            v-model="q"
            placeholder="Ara"
            class="search-input"
            type="text"
            @keyup="search"
          >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="search-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </div>
      </div>
    </div>

    <ul
      id="post-data"
      class="blog-list-posts py-3"
    >
      <list-blog :blogs="blogs" />
    </ul>

    <infinite-loading
      v-if="blogs.length"
      spinner="spiral"
      @infinite="infiniteScroll"
    >
      <div slot="spinner">
        Yükleniyor...
      </div>
      <div slot="no-results">
        Daha Fazla Veri Bulunamadı
      </div>
      <div slot="no-more">
        Daha Fazla Veri Bulunamadı
      </div>
    </infinite-loading>

  </section>
</template>

<script>

import { mapGetters } from 'vuex'
import listBlog from '@/components/index/listBlog'
import _ from 'lodash'
import '@/assets/style.css'

export default {
  components: {
    listBlog,
  },
  data() {
    return {
      page: 1,
      q: '',
    }
  },
  computed: {
    ...mapGetters({ blogs: 'getBlogs' }),
  },
  created() {
    if (this.$route.query.q) {
      this.q = this.$route.query.q
    }
    this.$store.commit('CLEAR_BLOGS')
    this.$store.commit('SET_BLOG_QUERY_PARAMS', { page: this.page, q: this.q })
    this.$store.dispatch('initBlogs')
  },
  methods: {
    infiniteScroll($state) {
      setTimeout(() => {
        if (this.blogs.length > 0) {
          // eslint-disable-next-line no-plusplus
          this.page++
          this.$store.commit('SET_BLOG_QUERY_PARAMS', { page: this.page, q: this.q })
          this.$store.dispatch('initBlogs').then(res => {
            if (res.data.blogs.docs.length > 1) {
              $state.loaded()
            } else {
              $state.complete()
            }
          })
        }
      }, 300)
    },
    search: _.debounce(function ()  {
      const query = { q: this.q }
      this.page = 1
      this.$store.commit('CLEAR_BLOGS')
      this.$store.commit('SET_BLOG_QUERY_PARAMS', { page: this.page, q: this.q })

      if (!_.isEqual(this.$route.query, query)) {
        this.$router.push({ query: { ...this.$route.query, ...query } })
      }
      this.$store.dispatch('initBlogs')
    }, 300),
  },
}
</script>
