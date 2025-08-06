import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Sermons from '../views/Sermons.vue';
import Blogs from '../views/Blogs.vue';
import Music from '../views/Music.vue';
import Shop from '../views/Shop.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/sermons', component: Sermons },
  { path: '/blogs', component: Blogs },
  { path: '/music', component: Music },
  { path: '/shop', component: Shop },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;