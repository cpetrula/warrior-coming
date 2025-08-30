<template>
  <div class="music-container p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Music</h1>
    <div class="banner"></div>
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="music.length === 0" class="text-center py-16">
      <div class="text-gray-400 text-xl mb-4">No music available yet</div>
      <p class="text-gray-500">Music will appear here once uploaded by an administrator.</p>
    </div>
    
    <div v-else class="music-list" v-for="musicItem in music" :key="musicItem.id">

      
      <div style="display:grid;grid-template-columns:60px 1fr;">
        <i class="pi pi-headphones mb-4"></i>
        <div>
          <div class="text-xl font-semibold text-white">{{ musicItem.title }}</div>
          <div class="text-sm text-gray-500">
                Added {{ formatDate(musicItem.createdAt) }}
          </div>
        </div>
      </div>
                   
      <div>
        <audio 
          controls 
          class="w-full"
          preload="metadata"
        >
          <source :src="`/uploads/${musicItem.musicFile}`" type="audio/mpeg">
          <source :src="`/uploads/${musicItem.musicFile}`" type="audio/wav">
          <source :src="`/uploads/${musicItem.musicFile}`" type="audio/ogg">
          Your browser does not support the audio element.
        </audio>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'

interface Music {
  id: string
  title: string
  musicFile: string
  order: number
  createdAt: string
}

// Reactive data
const music = ref<Music[]>([])
const loading = ref(false)

// Methods
const loadMusic = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/music')
    music.value = response.data
  } catch (error) {
    console.error('Error loading music:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Unknown date'
  }
}

// Lifecycle
onMounted(() => {
  loadMusic()
})
</script>

<style scoped>

.pi-headphones {
  color: whitesmoke;
  font-size:32pt;
}

.music-container {
  min-height: 100vh;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); */
}

.music-list {
  border-radius: 8px;
  padding: 1rem;
  display:grid;
  grid-template-columns: 280px 1fr;
}

.audio-player {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.audio-player audio {
  border-radius: 4px;
}

.banner {
  width:100%;
  height:270px;
  background-image: url('/images/music-banner.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 1rem;
}

 @media (max-width: 480px) {
  .music-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
 }
</style>
