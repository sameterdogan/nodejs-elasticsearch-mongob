<template>
  <section class="blog-post-container container pt-5">
    <div v-if="blog">
      <div class="blog-header d-flex justify-content-center align-items-center flex-column pb-2">
        <h1 class="blog-header-text">
          {{ blog.title }}
        </h1>

        <div class="blog-info d-flex flex-column justify-content-center align-items-center">
          <p class="source">
            Kaynak: <span class="source-text">{{ blog.category }}</span>
          </p>
          <p class="blog-date">
            <span class="date">{{ blog.createdAt }}</span>
          </p>
        </div>
      </div>
      <article class="main-blog-content"  >
        <div class="blog-paragraph" v-html="blog.content">

        </div>
      </article>
    </div>

  </section>
</template>

<script>
import '@/assets/style.css'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {

    }
  },
  created() {
    this.$store.dispatch('initBlog', this.$route.params.slug)
  },
  computed: {
    ...mapGetters({ blog: 'getBlog' }),
  },
  methods: {

  },
}
</script>
