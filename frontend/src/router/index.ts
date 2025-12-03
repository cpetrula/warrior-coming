import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Sermons from '../views/Sermons.vue';
import Blogs from '../views/Blogs.vue';
import Music from '../views/Music.vue';
import Shop from '../views/Shop.vue';
import Admin from '../views/Admin.vue';
import AboutUs from '../views/AboutUs.vue';
import ContactUs from '../views/ContactUs.vue';
import PrivacyPolicy from '../views/PrivacyPolicy.vue';
import TermsOfService from '../views/TermsOfService.vue';

const routes = [
  { path: '/', component: Home, meta:{title: 'Home - Warrior Coming'} },
  { path: '/sermons', component: Sermons, meta:{title: 'Sermons - Warrior Coming'} },
  { path: '/sermons/:id', component: Sermons, props: true, meta:{title: 'Sermons - Warrior Coming'} },
  { path: '/blogs', component: Blogs },
  { path: '/music', component: Music, meta:{title: 'Music - Warrior Coming'} },
  { path: '/shop', component: Shop },
  { path: '/admin', component: Admin },
  { path: '/about', component: AboutUs, meta:{title: 'About Us - Warrior Coming'} },
  { path: '/contact', component: ContactUs, meta:{title: 'Contact Us - Warrior Coming'} },
  { path: '/privacy', component: PrivacyPolicy, meta:{title: 'Privacy Policy - Warrior Coming'} },
  { path: '/terms', component: TermsOfService, meta:{title: 'Terms Of Service - Warrior Coming'} },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Warrior Coming'; // Fallback title
  next();
});

export default router;