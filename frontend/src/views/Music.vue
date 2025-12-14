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
    
    <div v-else class="music-list" v-for="musicItem in music" :key="musicItem.id" :id="`music-${musicItem.id}`">

      
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
        
        <!-- Action buttons -->
        <div class="action-buttons mt-3">
          <button 
            @click="downloadMusic(musicItem)"
            class="action-btn download-btn"
            title="Download this music"
          >
            <i class="pi pi-download"></i>
            <span class="btn-text">Download</span>
          </button>
          <button 
            @click="shareMusic(musicItem)"
            class="action-btn share-btn"
            title="Share this music"
          >
            <i class="pi pi-share-alt"></i>
            <span class="btn-text">Share</span>
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
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
const route = useRoute()

// Methods
const loadMusic = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/music')
    music.value = response.data
    
    // If there's an ID in the route, scroll to that music item
    if (route.params.id) {
      setTimeout(() => {
        const element = document.getElementById(`music-${route.params.id}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
          // Add a highlight effect
          element.classList.add('highlight')
          setTimeout(() => {
            element.classList.remove('highlight')
          }, 2000)
        }
      }, 100)
    }
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

const downloadMusic = async (musicItem: Music) => {
  try {
    // Create a temporary link to trigger download
    const link = document.createElement('a')
    link.href = `/api/music/${musicItem.id}/download`
    link.download = musicItem.musicFile
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading music:', error)
    alert('Failed to download music. Please try again.')
  }
}

const shareMusic = async (musicItem: Music) => {
  try {
    const shareUrl = `${window.location.origin}/music/${musicItem.id}`
    
    // Check if Web Share API is available (mainly on mobile)
    if (navigator.share) {
      await navigator.share({
        title: musicItem.title,
        text: `Listen to ${musicItem.title}`,
        url: shareUrl
      })
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    }
  } catch (error) {
    // If share is cancelled or fails, try clipboard as fallback
    if (error instanceof Error && error.name !== 'AbortError') {
      try {
        const shareUrl = `${window.location.origin}/music/${musicItem.id}`
        await navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard!')
      } catch (clipboardError) {
        console.error('Error sharing music:', clipboardError)
        alert('Failed to share music. Please try again.')
      }
    }
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
  transition: background-color 0.3s ease;
}

.music-list.highlight {
  background-color: rgba(102, 126, 234, 0.2);
  animation: pulse 0.5s ease-in-out 3;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
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

.action-buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 6px;
  border: none;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.download-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.share-btn {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(240, 147, 251, 0.4);
}

.action-btn:active {
  transform: translateY(0);
}

 @media (max-width: 480px) {
  .music-list {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .action-btn .btn-text {
    display: none;
  }
  
  .action-btn {
    padding: 0.625rem;
    justify-content: center;
    min-width: 44px;
  }
 }
</style>
