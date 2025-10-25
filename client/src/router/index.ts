import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import NotFound from '@/views/NotFound.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import PricingView from '@/views/PricingView.vue'
import ContactView from '@/views/ContactView.vue'
import { tokenHelpers } from '@/shared/utils'
import ProfileView from '@/views/ProfileView.vue'
import EditProfileView from '@/views/EditProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },
        {
          path: 'about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (About.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import('../views/AboutView.vue'),
        },
        {
          path: 'pricing',
          name: 'pricing',
          component: PricingView,
        },
        {
          path: 'contact',
          name: 'contact',
          component: ContactView,
        },
        {
          path: 'profile/:username',
          name: 'profile',
          component: ProfileView,
        },
        {
          path: 'profile/edit',
          name: 'profile edit',
          component: EditProfileView,
          meta: { requiresAuth: true },
        },
      ],
    },
    // Routes without navbar (Auth Layout)
    {
      path: '/',
      component: AuthLayout,
      children: [
        {
          path: 'sign-in',
          name: 'signIn',
          component: SignIn,
          meta: { requiresGuest: true },
        },
        {
          path: 'sign-up',
          name: 'signUp',
          component: SignUp,
          meta: { requiresGuest: true },
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound,
    },
  ],
})

// Global navigation guard
router.beforeEach(async (to, from, next) => {
  const token = tokenHelpers.getToken()
  const isAuthenticated = !!token

  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      path: '/sign-in',
      query: { redirect: to.fullPath }, // Save intended destination
    })
    return
  }

  // Check if route is for guests only (login/register)
  if (to.meta.requiresGuest && isAuthenticated) {
    next(`/profile`)
    return
  }

  next()
})

export default router
