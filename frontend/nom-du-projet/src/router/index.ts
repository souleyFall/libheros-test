import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw, RouteLocationNormalized } from 'vue-router';
import { useAuth } from '../stores/auth';

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../pages/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../pages/Register.vue'),
  },
  {
    path: '/main',
    name: 'Main',
    component: () => import('../pages/Main.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    redirect: '/main',
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard pour les routes protégées
router.beforeEach((to: RouteLocationNormalized) => {
  const { isAuthenticated } = useAuth();

  if (to.meta.requiresAuth && !isAuthenticated.value) {
    return '/login';
  } else if ((to.name === 'Login' || to.name === 'Register') && isAuthenticated.value) {
    return '/main';
  } else {
    return true;
  }
});

export default router;
