<template>
  <div class="">
    <div
      v-for="blog in blogs"
      :key="blog._id"
    >
      <div class="post-cnc d-flex flex-column align-items-end">
        <span class="blog-date px-2"> <span class="date">{{ moment(blog.createdAt).format('DD.MM.YYYY') }}</span></span>
      </div>
      <li class="post-item   ">
        <router-link
          :to="{name:'blog-details',params:{slug:blog.slug}}"
          class="post-a d-flex align-items-center justify-content-between"
        >
          {{ blog.title }}
          <div class="post-cnc-for-mobile d-flex flex-column align-items-start">
            <span class="blog-date px-2"> <span class="date">{{ blog.createdAt }}</span></span>
          </div>
          <div class="post-cnc-c d-flex flex-column align-items-start">
            <span class="source px-2">Kaynak: <span class="source-text">{{ blog.category }}</span></span>
          </div>
        </router-link>
      </li>
    </div>

  </div>
</template>

<script>
import moment from 'moment'

export default {
  props: ['blogs'],
  data() {
    return {
      moment,
    }
  },

}
</script>
