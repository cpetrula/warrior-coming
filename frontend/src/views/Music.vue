<template>
  <div class="music-container p-6" :class="{ 'with-player': currentSong }">
    <h1 class="text-3xl font-bold mb-6 text-white">Music</h1>
    <div class="banner"></div>
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="music.length === 0" class="text-center py-16">
      <div class="text-gray-400 text-xl mb-4">No music available yet</div>
      <p class="text-gray-500">Music will appear here once uploaded by an administrator.</p>
    </div>
    
    <div v-else class="music-list-container">
      <div 
        v-for="musicItem in music" 
        :key="musicItem.id" 
        :id="`music-${musicItem.id}`"
        class="music-list-item"
        :class="{ 'active': currentSong && currentSong.id === musicItem.id }"
        @click="playSong(musicItem)"
      >
        <i class="pi pi-headphones"></i>
        <div class="song-info">
          <div class="song-title">{{ musicItem.title }}</div>
        </div>
        <i v-if="currentSong && currentSong.id === musicItem.id && !isPaused" class="pi pi-volume-up playing-indicator"></i>
        <i v-else class="pi pi-play play-icon"></i>
      </div>
    </div>

    <!-- Fixed Audio Player at Bottom -->
    <div v-if="currentSong" class="fixed-audio-player">
      <div class="player-content"> 
        <div class="player-info">
          <i class="pi pi-music player-icon"></i>
          <div class="current-song-details">
            <div class="current-song-title">{{ currentSong.title }}</div>
          </div>
        </div>
        
        <div class="player-controls">
          <audio 
            ref="audioPlayer"
            @play="isPaused = false"
            @pause="isPaused = true"
            @ended="onSongEnded"
            controls 
            class="audio-element"
            preload="metadata"
          >
            <source :src="`/uploads/${currentSong.musicFile}`" type="audio/mpeg">
            <source :src="`/uploads/${currentSong.musicFile}`" type="audio/wav">
            <source :src="`/uploads/${currentSong.musicFile}`" type="audio/ogg">
            Your browser does not support the audio element.
          </audio>
        </div>

        <!-- Action buttons -->
        <div class="action-buttons">
          <button 
            @click.stop="downloadMusic(currentSong)"
            class="action-btn download-btn"
            title="Download this music"
          >
            <i class="pi pi-download"></i>
            <span class="btn-text">Download</span>
          </button>
          <button 
            @click.stop="shareMusic(currentSong)"
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
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Card from 'primevue/card'
import ProgressSpinner from 'primevue/progressspinner'

interface Music {
  id: string
  title: string
  musicFile: string
  seoTitle?: string
  seoDescription?: string
  order: number
  createdAt: string
}

// Reactive data
const music = ref<Music[]>([])
const loading = ref(false)
const currentSong = ref<Music | null>(null)
const isPaused = ref(true)
const audioPlayer = ref<HTMLAudioElement | null>(null)
const route = useRoute()
const router = useRouter()

// Methods
const loadMusic = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/music')
    music.value = response.data
    
    // If there's an ID in the route, load and play that song
    if (route.params.id) {
      await nextTick()
      const songToPlay = music.value.find(m => m.id === route.params.id)
      if (songToPlay) {
        playSong(songToPlay)
        // Scroll to the song item
        const element = document.getElementById(`music-${route.params.id}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
  } catch (error) {
    console.error('Error loading music:', error)
  } finally {
    loading.value = false
  }
}

const playSong = (musicItem: Music) => {
  currentSong.value = musicItem
  // Update URL without reloading the page
  router.push(`/music/${musicItem.id}`)
  
  // Update page metadata
  updatePageMetadata(musicItem)
  
  // Wait for next tick to ensure audio element is rendered
  nextTick(() => {
    if (audioPlayer.value) {
      audioPlayer.value.load()
      audioPlayer.value.play().catch(error => {
        console.error('Error playing audio:', error)
      })
    }
  })
}

const updatePageMetadata = (musicItem: Music) => {
  // Update document title
  const pageTitle = musicItem.seoTitle || musicItem.title || 'Music'
  document.title = `${pageTitle} - Warrior Coming`
  
  // Update meta description
  const metaDescription = musicItem.seoDescription || `Listen to ${musicItem.title} from Warrior Coming`
  let metaTag = document.querySelector('meta[name="description"]')
  
  if (!metaTag) {
    metaTag = document.createElement('meta')
    metaTag.setAttribute('name', 'description')
    document.head.appendChild(metaTag)
  }
  
  metaTag.setAttribute('content', metaDescription)
}

const onSongEnded = () => {
  // Optionally play next song
  const currentIndex = music.value.findIndex(m => m.id === currentSong.value?.id)
  if (currentIndex >= 0 && currentIndex < music.value.length - 1) {
    playSong(music.value[currentIndex + 1])
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
  let link: HTMLAnchorElement | null = null
  try {
    // Create a temporary link to trigger download
    link = document.createElement('a')
    link.href = `/api/music/${musicItem.id}/download`
    link.download = musicItem.musicFile
    document.body.appendChild(link)
    link.click()
  } catch (error) {
    console.error('Error downloading music:', error)
    alert('Failed to download music. Please try again.')
  } finally {
    // Clean up the link element
    if (link && document.body.contains(link)) {
      document.body.removeChild(link)
    }
  }
}

const shareMusic = async (musicItem: Music) => {
  const shareUrl = `${window.location.origin}/music/${musicItem.id}`
  
  try {
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
        await navigator.clipboard.writeText(shareUrl)
        alert('Link copied to clipboard!')
      } catch (clipboardError) {
        console.error('Error sharing music:', clipboardError)
        alert('Failed to share music. Please try again.')
      }
    }
  }
}

// Watch for route changes
watch(() => route.params.id, (newId) => {
  if (newId && music.value.length > 0) {
    const songToPlay = music.value.find(m => m.id === newId)
    if (songToPlay && (!currentSong.value || currentSong.value.id !== newId)) {
      playSong(songToPlay)
    }
  }
})

// Lifecycle
onMounted(() => {
  loadMusic()
})
</script>

<style scoped>
.music-container {
  min-height: 100vh;
  padding-bottom: 180px; /* Space for fixed player */
}

.music-container.with-player {
  padding-bottom: 200px; /* Extra space when player is visible */
}

.banner {
  width: 100%;
  height: 270px;
  background-image: url('/images/music-banner.jpg');
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.music-list-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.music-list-item {
  border-radius: 8px;
  background-color: #222;
  padding: 1.25rem;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.music-list-item:hover {
  background-color: #2a2a2a;
  transform: translateX(4px);
}

.music-list-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
  border: 1px solid rgba(102, 126, 234, 0.4);
}

.music-list-item .pi-headphones {
  color: whitesmoke;
  font-size: 24pt;
}

.song-info {
  flex: 1;
}

.song-title {
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
}

.play-icon {
  color: #999;
  font-size: 20pt;
  transition: color 0.2s ease;
}

.music-list-item:hover .play-icon {
  color: white;
}

.playing-indicator {
  color: #667eea;
  font-size: 20pt;
  animation: pulse-icon 1.5s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Fixed Audio Player */
.fixed-audio-player {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, #1a1a1a 0%, #222 100%);
  border-top: 2px solid #667eea;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.player-content {
  padding: 1rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr 2fr 200px;
  gap: 1.5rem;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.player-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.player-icon {
  color: #667eea;
  font-size: 24pt;
  flex-shrink: 0;
}

.current-song-details {
  min-width: 0;
  flex: 1;
}

.current-song-title {
  color: white;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.player-controls {
  display: flex;
  justify-content: center;
}

.audio-element {
  width: 100%;
  max-width: 600px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 6px;
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .player-content {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }

  .player-info {
    order: 1;
  }

  .player-controls {
    order: 2;
  }

  .action-buttons {
    order: 3;
    justify-content: center;
  }

  .action-btn .btn-text {
    display: inline;
  }
}

@media (max-width: 480px) {
  .music-list-item {
    grid-template-columns: 40px 1fr 40px;
    padding: 1rem;
  }

  .music-list-item .pi-headphones {
    font-size: 18pt;
  }

  .song-title {
    font-size: 0.95rem;
  }

  .play-icon,
  .playing-indicator {
    font-size: 16pt;
  }

  .action-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.8rem;
  }

  .action-btn .btn-text {
    display: none;
  }

  .action-btn {
    min-width: 44px;
    justify-content: center;
  }

  .banner {
    height: 150px;
  }
}
</style>
