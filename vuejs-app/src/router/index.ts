import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/error-lab',
    name: 'ErrorLab',
    // lazy-loaded
    component: () => import('../views/ErrorLabView.vue')
  },
  {
    path: '/users/:id',
    name: 'User',
    component: () => import('../views/UserView.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFoundView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
