<template>
  <div class="music-container p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Music</h1>
    
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="music.length === 0" class="text-center py-16">
      <div class="text-gray-400 text-xl mb-4">No music available yet</div>
      <p class="text-gray-500">Music will appear here once uploaded by an administrator.</p>
    </div>
    
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card 
        v-for="musicItem in music" 
        :key="musicItem.id"
        class="music-card"
      >
        <template #content>
          <div class="text-center">
            <div class="mb-4">
              <i class="pi pi-music text-6xl text-blue-500"></i>
            </div>
            
            <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ musicItem.title }}</h3>
            
            <div class="audio-player">
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
            
            <div class="mt-3 text-sm text-gray-500">
              Added {{ formatDate(musicItem.createdAt) }}
            </div>
          </div>
        </template>
      </Card>
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
.music-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.music-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.music-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.audio-player {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.audio-player audio {
  border-radius: 4px;
}
</style>
