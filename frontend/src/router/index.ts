import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Sermons from '../views/Sermons.vue';
import Blogs from '../views/Blogs.vue';
import Music from '../views/Music.vue';
import Shop from '../views/Shop.vue';
import Admin from '../views/Admin.vue';
import AboutUs from '../views/AboutUs.vue';
import ContactUs from '../views/ContactUs.vue';
import ThankYou from '../views/ThankYou.vue';
import PrivacyPolicy from '../views/PrivacyPolicy.vue';
import TermsOfService from '../views/TermsOfService.vue';
import NotFound from '../views/NotFound.vue';

const routes = [
  { path: '/', component: Home, meta: { title: 'Online Christian Ministry For Faith & Biblical Teaching | Warrior Coming', description: 'Online Christian ministry focused on faith and biblical teaching, offering spiritual encouragement grounded in Scripture. Your spiritual journey awaits.', canonical: 'https://warriorcoming.com/' } },
  { path: '/sermons', component: Sermons, meta: { title: 'Bible Based Christian Sermons For Faith & Growth | Warrior Coming', description: 'Bible based Christian sermons that support faith growth, spiritual strength and practical biblical teaching. Your spiritual journey awaits.', canonical: 'https://warriorcoming.com/sermons' } },
  { path: '/sermons/:id', component: Sermons, props: true, meta: { canonical: 'https://warriorcoming.com/sermons' } },
  { path: '/blogs', component: Blogs, meta: { canonical: 'https://warriorcoming.com/blogs' } },
  { path: '/music', component: Music, meta: { title: 'Christian Worship Music For Prayer & Reflection | Warrior Coming', description: 'Christian worship music for prayer and reflection, featuring faith based and Bible inspired worship songs. Your spiritual journey awaits.', canonical: 'https://warriorcoming.com/music' } },
  { path: '/music/:id', component: Music, props: true, meta: { canonical: 'https://warriorcoming.com/music' } },
  { path: '/shop', component: Shop, meta: { canonical: 'https://warriorcoming.com/shop' } },
  { path: '/admin', component: Admin, meta: { noindex: true, canonical: 'https://warriorcoming.com/admin' } },
  { path: '/about', component: AboutUs, meta: { title: 'About Us - Warrior Coming', description: 'We are a Christian faith ministry dedicated to biblical teaching, worship and spiritual encouragement. Read more here.', canonical: 'https://warriorcoming.com/about' } },
  { path: '/contact', component: ContactUs, meta: { title: 'Contact Us - Warrior Coming', description: 'Contact us to connect with our online Christian ministry and faith centered resources. Learn more here.', canonical: 'https://warriorcoming.com/contact' } },
  { path: '/thank-you', component: ThankYou, meta: { title: 'Thank You - Warrior Coming', canonical: 'https://warriorcoming.com/thank-you' } },
  { path: '/privacy', component: PrivacyPolicy, meta: { title: 'Privacy Policy - Warrior Coming', description: 'Privacy policy outlining how Warrior Coming protects your data within our online Christian ministry. Learn more here.', canonical: 'https://warriorcoming.com/privacy' } },
  { path: '/terms', component: TermsOfService, meta: { title: 'Terms & Conditions - Warrior Coming', description: 'Terms and conditions governing the use of Warrior Coming and its Christian ministry services. Learn more here.', canonical: 'https://warriorcoming.com/terms' } },
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
      if (to.meta.title) {
        document.title = to.meta.title;
      }

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