import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignIn from '../views/SignIn.vue'
import SignUp from '@/views/SignUp.vue'
import NotFound from '@/views/NotFound.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import DefaultLayout from './layouts/DefaultLayout.vue'
import ProfileView from '@/views/ProfileView.vue'
import EditProfileView from '@/views/EditProfileView.vue'
import { useAuthStore } from '@/stores/auth'
import VerifyEmail from '@/views/VerifyEmail.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'

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
        {
          path: 'verify-email',
          name: 'verify email',
          component: VerifyEmail,
        },
        {
          path: '/forgot-password',
          name: 'forgot password',
          component: ForgotPassword,
        },
        {
          path: '/reset-password',
          name: 'reset password',
          component: ResetPassword,
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
  const authStore = useAuthStore()

  if (!authStore.isInitialized) {
    await authStore.initialize()
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({
      path: '/sign-in',
    })
    return
  }

  // Check if route is for guests only (login/register)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next(`/profile/${authStore.user?.username}`)
    return
  }

  next()
})

export default router
