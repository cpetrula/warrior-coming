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
import NotFound from '../views/NotFound.vue';

const routes = [
  { path: '/', component: Home, meta: { title: 'Home - Warrior Coming', canonical: 'https://warriorcoming.com/' } },
  { path: '/sermons', component: Sermons, meta: { title: 'Sermons - Warrior Coming', canonical: 'https://warriorcoming.com/sermons' } },
  { path: '/sermons/:id', component: Sermons, props: true, meta: { title: 'Sermons - Warrior Coming', canonical: 'https://warriorcoming.com/sermons' } },
  { path: '/blogs', component: Blogs, meta: { canonical: 'https://warriorcoming.com/blogs' } },
  { path: '/music', component: Music, meta: { title: 'Music - Warrior Coming', canonical: 'https://warriorcoming.com/music' } },
  { path: '/shop', component: Shop, meta: { canonical: 'https://warriorcoming.com/shop' } },
  { path: '/admin', component: Admin, meta: { canonical: 'https://warriorcoming.com/admin' } },
  { path: '/about', component: AboutUs, meta: { title: 'About Us - Warrior Coming', canonical: 'https://warriorcoming.com/about' } },
  { path: '/contact', component: ContactUs, meta: { title: 'Contact Us - Warrior Coming', canonical: 'https://warriorcoming.com/contact' } },
  { path: '/privacy', component: PrivacyPolicy, meta: { title: 'Privacy Policy - Warrior Coming', canonical: 'https://warriorcoming.com/privacy' } },
  { path: '/terms', component: TermsOfService, meta: { title: 'Terms Of Service - Warrior Coming', canonical: 'https://warriorcoming.com/terms' } },
  { path: '/:pathMatch(.*)*', component: NotFound, meta: { title: 'Page Not Found - Warrior Coming' } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
 
  if (window.location.hostname === 'www.warriorcoming.com') {
    window.location.replace(`https://warriorcoming.com${to.fullPath}`);
  } else {
      // Update the document title
    document.title = to.meta.title || 'Warrior Coming'; // Fallback title

    // Update the canonical tag
    const canonicalUrl = to.meta.canonical || `https://warriorcoming.com${to.path}`;
    let linkTag = document.querySelector("link[rel='canonical']");

    if (!linkTag) {
      linkTag = document.createElement('link');
      linkTag.setAttribute('rel', 'canonical');
      document.head.appendChild(linkTag);
    }

    linkTag.setAttribute('href', canonicalUrl);

    next();
  }
});

export default router;