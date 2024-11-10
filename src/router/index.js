import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';
import LoginView from '../views/Login.vue';
import TictactoeView from '../views/Tictactoe.vue';
import { getAuth } from 'firebase/auth';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/Login',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/Tictactoe',
    name: 'Tictactoe',
    component: TictactoeView,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const user = getAuth().currentUser;

  if (to.matched.some(record => record.meta.requiresAuth) && !user) {
      next('/Login');
  } else {
    next();
  }
});

export default router;
