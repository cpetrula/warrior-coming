import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.ts';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import 'primeicons/primeicons.css';
import './assets/styles/main.scss'

const app = createApp(App);
app.use(router);
app.use(PrimeVue,{
    theme: {preset:Aura}
});
app.mount('#app');
