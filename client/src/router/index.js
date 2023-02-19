import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'blog-list',
      component: () => import('@/views/index/blogs'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/blog/:slug',
      name: 'blog-details',
      component: () => import('@/views/index/blogDetails'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/admin',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        pageTitle: 'Home',
        breadcrumb: [
          {
            text: 'Home',
            active: true,
          },
        ],
        requiresAuth: true,
      },
    },
    {
      path: '/admin/blog',
      name: 'blogs',
      component: () => import('@/views/blogs.vue'),
      meta: {
        pageTitle: 'Yazılar',
        breadcrumb: [
          {
            text: 'Yazılar',
            active: true,
          },
        ],
        requiresAuth: true,
      },
    },
    {
      path: '/admin/blog/create',
      name: 'create-blog',
      component: () => import('@/views/createBlog.vue'),
      meta: {
        pageTitle: 'Yazı Oluştur',
        breadcrumb: [
          {
            text: 'Yazı Oluştur',
            active: true,
          },
        ],
        requiresAuth: true,
      },
    },
    {
      path: '/admin/login',
      name: 'login',
      component: () => import('@/views/auth/login.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.requiresAuth && !localStorage.getItem('token')) {
    next({ name: 'login' })
  }
  if (localStorage.getItem('token') && to.name === 'login') {
    next({ name: 'create-blog' })
  }
  next()
})

export default router
