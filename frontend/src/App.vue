<template>
  <div id="app">
    <!-- <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/sermons">Sermons</router-link>
      <router-link to="/blogs">Blogs</router-link>
      <router-link to="/music">Music</router-link>
      <router-link to="/shop">Shop</router-link>
    </nav> -->
    <div class="grid grid-cols-2" style="position:absolute;left:0;top:0;right:0;z-index:1;">
      <div >
        <router-link to="/" class="logo">
        Warrior Coming
          <!-- <img src="/images/thewarrior.png" alt="Logo" /> -->
        </router-link>
      </div>
      <div class="text-right">
        <i class="pi pi-bars menu-icon" @click="showMenu = true" style="color:white;font-size: 2em; cursor: pointer;"></i>
      </div>
    </div>
    <router-view />
  </div>
  <Drawer v-model:visible="showMenu" header="Menu" position="right">
      <div class="grid grid-cols-1 gap-2">
        <router-link to="/">Home</router-link>
        <router-link to="/sermons">Sermons</router-link>
        <router-link to="/blogs">Blogs</router-link>
        <router-link to="/music">Music</router-link>
        <router-link to="/shop">Shop</router-link>
      </div>
      
    </Drawer>
</template>
<script lang="ts" setup>
import Button  from 'primevue/button'
import Drawer from 'primevue/drawer'
import { PrimeIcons } from '@primevue/core/api';
import { ref } from 'vue'

const showMenu = ref(false);

</script>

<style>
@font-face {
  font-family: 'Cinzel Decorative';
  font-style: normal;
  font-display: swap;
  font-weight: 400;
  src: url(https://cdn.jsdelivr.net/fontsource/fonts/cinzel-decorative@latest/latin-400-normal.woff2) format('woff2'), url(https://cdn.jsdelivr.net/fontsource/fonts/cinzel-decorative@latest/latin-400-normal.woff) format('woff');
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #333;
  color: white;
}
a {
  color: white;
  text-decoration: none;
}
.logo {
  display:block;
  margin:20px 0 0 20px;
  font-size:2.5em;
  font-family:'Cinzel Decorative';
}

.menu-icon {
  color: white;
  font-size: 2em;
  cursor: pointer;
  margin: 20px 20px 0 0;
}
</style>