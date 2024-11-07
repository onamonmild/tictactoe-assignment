import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/Home.vue';
import LoginView from '../views/Login.vue';
import TictactoeView from '../views/Tictactoe.vue';

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
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
