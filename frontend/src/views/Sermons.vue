<template>
  <div class="sermons-container p-6">
    <!-- <h1 class="text-3xl font-bold mb-6 text-white">Sermons</h1> -->
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner />
    </div>
    
    <!-- No Sermons State -->
    <div v-else-if="sermons.length === 0" class="text-center py-8 text-gray-400">
      No sermons available at this time.
    </div>
    
    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Selected Sermon Player -->
      <div class="lg:col-span-2 lg:order-2 order-1">
        <Card v-if="selectedSermon" class="mb-6 mobile-sermon-selector lg:hidden">
          <template #content>
            <div class="space-y-3">
              <div>
                <label for="mobile-sermon-select" class="block text-sm font-medium text-gray-300 mb-2">Choose Sermon</label>
                <select
                  id="mobile-sermon-select"
                  class="mobile-sermon-select"
                  :value="selectedSermon.id"
                  @change="onMobileSermonChange"
                >
                  <option v-for="sermon in sermons" :key="sermon.id" :value="sermon.id">
                    {{ sermon.title }} — {{ formatDate(sermon.date) }}
                  </option>
                </select>
              </div>
              <div class="mobile-sermon-nav">
                <Button
                  label="Prev"
                  icon="pi pi-chevron-left"
                  severity="secondary"
                  outlined
                  @click="goToPrevSermon"
                  :disabled="selectedSermonIndex <= 0"
                />
                <p class="text-sm text-gray-400 mobile-sermon-counter">Showing sermon {{ selectedSermonIndex + 1 }} of {{ sermons.length }}</p>
                <Button
                  label="Next"
                  icon="pi pi-chevron-right"
                  iconPos="right"
                  severity="secondary"
                  outlined
                  @click="goToNextSermon"
                  :disabled="selectedSermonIndex === -1 || selectedSermonIndex >= sermons.length - 1"
                />
              </div>
            </div>
          </template>
        </Card>

        <div v-if="selectedSermon" class="space-y-6">
          <!-- Sermon Header -->
          <Card>
            <template #title>
                             
                <div class="grid grid-cols-2 auto-cols-max">
                  <h2 class="text-xl font-bold text-gray-200">{{ selectedSermon.title }}</h2>
                  <!-- <p class="text-gray-400 text-right">{{ formatDate(selectedSermon.date) }}</p> -->
                </div>
             
            </template>
            <template #content>
              <p v-if="selectedSermon.description" class="text-gray-300 pb-4">
                {{ selectedSermon.description }}
              </p>
              
              <!-- Social Media Sharing -->
              <div class="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded">
                <span class="text-sm font-medium text-gray-600">Share this sermon:</span>
                <div class="flex gap-2">
                  <Button
                    icon="pi pi-facebook"
                    size="small"
                    text
                    rounded
                    class="p-button-facebook"
                    @click="shareOnFacebook"
                    :aria-label="`Share ${selectedSermon.title} on Facebook`"
                    title="Share on Facebook"
                  />
                  <Button
                    icon="pi pi-twitter"
                    size="small"
                    text
                    rounded
                    class="p-button-twitter"
                    @click="shareOnTwitter"
                    :aria-label="`Share ${selectedSermon.title} on Twitter`"
                    title="Share on X"
                  />
                  <Button
                    icon="pi pi-whatsapp"
                    size="small"
                    text
                    rounded
                    class="p-button-whatsapp"
                    @click="shareOnWhatsApp"
                    :aria-label="`Share ${selectedSermon.title} on WhatsApp`"
                    title="Share on WhatsApp"
                  />
                  <Button
                    icon="pi pi-copy"
                    size="small"
                    text
                    rounded
                    class="p-button-secondary"
                    @click="copyLink"
                    :aria-label="`Copy link to ${selectedSermon.title}`"
                    title="Copy link"
                  />
                </div>
              </div>
            </template>
          </Card>
          
          <!-- YouTube Video Player -->
          <Card v-if="validatedYoutubeId">
            <template #content>
              <div class="youtube-player-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                <iframe 
                  :src="`https://www.youtube.com/embed/${validatedYoutubeId}`"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen
                  :title="`${selectedSermon.title} - YouTube Video`"
                />
              </div>
            </template>
          </Card>
          
          <!-- Image Gallery -->
          <Card v-if="galleryImages.length > 0">
          
            <template #content>
              <Galleria 
                v-if="galleryImages.length === 1"
                :value="galleryImages" 
                :showThumbnails="false"
                :showItemNavigators="false"
                :showIndicators="false"
                containerStyle="max-width: 100%"
                class="custom-galleria"
              >
                <template #item="slotProps">
                  <img 
                    :src="slotProps.item.itemImageSrc" 
                    :alt="slotProps.item.alt" 
                    style="width: 100%; "
                    class="rounded"
                  />
                </template>
              </Galleria>
              <Galleria 
                v-else
                :value="galleryImages" 
                :responsiveOptions="responsiveOptions"
                :numVisible="Math.min(4, galleryImages.length)"
                :circular="true"
                :showThumbnails="true"
                :showItemNavigators="true"
                :showIndicators="true"
                containerStyle="max-width: 100%"
                class="custom-galleria"
              >
                <template #item="slotProps">
                  <img 
                    :src="slotProps.item.itemImageSrc" 
                    :alt="slotProps.item.alt" 
                    style="width: 100%;"
                    class="rounded"
                  />
                </template>
                <template #thumbnail="slotProps">
                  <img 
                    :src="slotProps.item.thumbnailImageSrc" 
                    :alt="slotProps.item.alt"
                    style="width: 60px; height: 60px; object-fit: cover;"
                    class="rounded"
                  />
                </template>
              </Galleria>
            </template>
          </Card>
          <!-- Notes Text -->
          <Card v-if="selectedSermon.notes">
            <template #title>
              <span class="text-lg font-semibold flex items-center">
                <i class="pi pi-file-edit mr-2"></i>
                Notes
              </span>
            </template>
            <template #content>
              <div class="prose max-w-none text-gray-300 whitespace-pre-wrap">{{ selectedSermon.notes }}</div>
            </template>
          </Card>
        </div>
        
        <!-- No Sermon Selected -->
        <div v-else class="text-center py-16">
          <i class="pi pi-music text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-xl font-semibold text-gray-600 mb-2">Select a Sermon</h3>
          <p class="text-gray-500">Choose a sermon from the list to play audio and view notes</p>
        </div>
      </div>

      <!-- Sermons List -->
      <div class="lg:col-span-1 lg:order-1 order-2 hidden lg:block">
        <Card class="h-fit lg:sticky lg:top-6">
          <template #title>
            <h1>Sermons</h1>
          </template>
          <template #content>
            <div class="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
              <div 
                v-for="sermon in sermons" 
                :key="sermon.id"
                class="sermon-item p-4 border rounded cursor-pointer transition-colors"
                :class="{ 
                  'bg-blue-50 border-blue-300': selectedSermon?.id === sermon.id,
                  'hover:bg-gray-50 border-gray-200': selectedSermon?.id !== sermon.id
                }"
                @click="selectSermon(sermon)"
              >
                <div class="flex items-start space-x-3">
                  <div class="flex-shrink-0">
                    <Image 
                      v-if="sermon.imageFile"
                      :src="`/uploads/${sermon.imageFile}`" 
                      alt="Sermon Image"
                      width="60"
                      height="60"
                      class="rounded"
                    />
                    <div v-else class="w-15 h-15 bg-gray-300 rounded flex items-center justify-center">
                      <i class="pi pi-image text-gray-500"></i>
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-sm text-gray-900 truncate">{{ sermon.title }}</h3>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(sermon.date) }}</p>
                    <p v-if="sermon.description" class="text-xs text-gray-600 mt-1 line-clamp-2">
                      {{ sermon.description.length > 80 ? sermon.description.substring(0, 80) + '...' : sermon.description }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useTemplateRef, ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Image from 'primevue/image'
import ProgressSpinner from 'primevue/progressspinner'
import Galleria from 'primevue/galleria'
import { updatePageMetadata } from '../utils/seo'

interface SermonImage {
  id: string
  sermonId: string
  imageFile: string
  createdAt: string
}

interface Sermon {
  id: string
  title: string
  date: string
  description?: string
  audioFile?: string | null
  imageFile?: string
  notesFile?: string
  youtubeId?: string
  notes?: string
  seoTitle?: string
  seoDescription?: string
  order: number
  createdAt: string
  images?: SermonImage[]
}

// Router
const route = useRoute()
const router = useRouter()

// Reactive data
const sermons = ref<Sermon[]>([])
const selectedSermon = ref<Sermon | null>(null)
const loading = ref(false)

// Galleria responsive options
const responsiveOptions = ref([
  {
    breakpoint: '1024px',
    numVisible: 3
  },
  {
    breakpoint: '768px',
    numVisible: 2
  },
  {
    breakpoint: '560px',
    numVisible: 1
  }
])

// Computed properties
const selectedSermonIndex = computed(() => {
  if (!selectedSermon.value) return -1
  return sermons.value.findIndex(sermon => sermon.id === selectedSermon.value?.id)
})

// Validate and sanitize YouTube ID
const validatedYoutubeId = computed(() => {
  if (!selectedSermon.value?.youtubeId) return null
  
  const youtubeId = selectedSermon.value.youtubeId
  // YouTube IDs are 11 characters: letters, numbers, hyphens, and underscores only
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/
  
  return youtubeIdPattern.test(youtubeId) ? youtubeId : null
})

const galleryImages = computed(() => {
  if (!selectedSermon.value) return []
  
  const images = []
  
  // Add main image first if it exists
  if (selectedSermon.value.imageFile) {
    images.push({
      itemImageSrc: `/uploads/${selectedSermon.value.imageFile}`,
      thumbnailImageSrc: `/uploads/${selectedSermon.value.imageFile}`,
      alt: `${selectedSermon.value.title} - Main Image`,
      title: `${selectedSermon.value.title} - Main Image`
    })
  }
  
  // Add additional images from the images array
  if (selectedSermon.value.images && selectedSermon.value.images.length > 0) {
    selectedSermon.value.images.forEach((image, index) => {
      images.push({
        itemImageSrc: `/uploads/${image.imageFile}`,
        thumbnailImageSrc: `/uploads/${image.imageFile}`,
        alt: `${selectedSermon.value.title} - Image ${index + 2}`,
        title: `${selectedSermon.value.title} - Image ${index + 2}`
      })
    })
  }
  
  return images
})

// Methods
const loadSermons = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/sermons')
    sermons.value = response.data || []
    
    // Check if there's a sermon ID in the URL
    const sermonId = route.params.id as string
    if (sermonId) {
      // Find and select the sermon with the matching ID
      const foundSermon = sermons.value.find(sermon => sermon.id === sermonId)
      if (foundSermon) {
        selectedSermon.value = foundSermon
        updateSermonMetadata(foundSermon)
      } else {
        // If sermon not found, redirect to sermons list
        router.push('/sermons')
      }
    } else {
      // Auto-select the first sermon if no ID in URL and no sermon selected
      if (sermons.value.length > 0 && !selectedSermon.value) {
        selectedSermon.value = sermons.value[0]
        updateSermonMetadata(sermons.value[0])
      }
    }
  } catch (error) {
    console.error('Error loading sermons:', error)
    sermons.value = [] // Ensure sermons is always an array
  } finally {
    loading.value = false
  }
}

const selectSermon = (sermon: Sermon) => {
  selectedSermon.value = sermon
  
  // Navigate to the unique URL for this sermon
  if (route.params.id !== sermon.id) {
    router.push(`/sermons/${sermon.id}`)
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
  updateSermonMetadata(sermon)
}

const onMobileSermonChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const sermon = sermons.value.find(item => item.id === target.value)
  if (sermon) {
    selectSermon(sermon)
  }
}

const goToPrevSermon = () => {
  if (selectedSermonIndex.value > 0) {
    selectSermon(sermons.value[selectedSermonIndex.value - 1])
  }
}

const goToNextSermon = () => {
  if (selectedSermonIndex.value >= 0 && selectedSermonIndex.value < sermons.value.length - 1) {
    selectSermon(sermons.value[selectedSermonIndex.value + 1])
  }
}

const updateSermonMetadata = (sermon: Sermon) => {
  const pageTitle = sermon.seoTitle || sermon.title || 'Sermon'
  const metaDescription = sermon.seoDescription || sermon.description || ''
  updatePageMetadata(pageTitle, metaDescription)
}

const formatDate = (dateString: string) => {
  if (!dateString) return 'No date available'
  
  // Handle different date formats
  const date = new Date(dateString)
  
  // Check if date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date'
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Social Media Sharing Functions
const getSermonUrl = () => {
  const baseUrl = window.location.origin
  return `${baseUrl}/sermons/${selectedSermon.value?.id}`
}

const getShareText = () => {
  const title = selectedSermon.value?.title || 'Sermon'
  const date = selectedSermon.value?.date ? ` from ${formatDate(selectedSermon.value.date)}` : ''
  return `Check out this sermon: "${title}"${date} from Warrior Coming`
}

const shareOnFacebook = () => {
  if (!selectedSermon.value) return
  
  const url = getSermonUrl()
  const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
  window.open(shareUrl, '_blank', 'width=600,height=400')
}

const shareOnTwitter = () => {
  if (!selectedSermon.value) return
  
  const url = getSermonUrl()
  const text = getShareText()
  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
  window.open(shareUrl, '_blank', 'width=600,height=400')
}

const shareOnWhatsApp = () => {
  if (!selectedSermon.value) return
  
  const url = getSermonUrl()
  const text = getShareText()
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
  window.open(shareUrl, '_blank')
}

const copyLink = async () => {
  if (!selectedSermon.value) return
  
  const url = getSermonUrl()
  
  try {
    await navigator.clipboard.writeText(url)
    // Show a simple toast notification (we can use the browser's native notification for now)
    alert('Link copied to clipboard!')
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = url
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    alert('Link copied to clipboard!')
  }
}

// Lifecycle
onMounted(() => {
  loadSermons()
})

// Watch for route changes to handle direct navigation to sermon URLs
watch(() => route.params.id, (newId) => {
  if (newId && sermons.value.length > 0) {
    const foundSermon = sermons.value.find(sermon => sermon.id === newId)
    if (foundSermon) {
      selectedSermon.value = foundSermon
      updateSermonMetadata(foundSermon)
    }
  } else if (!newId && sermons.value.length > 0) {
    // If navigated back to /sermons without ID, select first sermon
    selectedSermon.value = sermons.value[0]
    updateSermonMetadata(sermons.value[0])
  }
})
</script>

<style scoped>
.sermons-container {
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(to bottom, #000, #1a1a1a);
}

.sermon-item {
  transition: all 0.2s ease;
}

.sermon-item:hover {
  transform: translateY(-1px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Responsive audio player */
audio {
  max-width: 100%;
  height: 40px;
}

/* PDF viewer responsive */
iframe {
  min-height: 400px;
}

/* Custom Galleria styling */
.custom-galleria {
  max-width: 100%;
}

.custom-galleria .p-galleria-thumbnail-items {
  background: rgba(0, 0, 0, 0.9);
  padding: 0.5rem;
}

.custom-galleria .p-galleria-thumbnail-item {
  opacity: 0.6;
  transition: opacity 0.3s;
}

.custom-galleria .p-galleria-thumbnail-item.p-galleria-thumbnail-item-current {
  opacity: 1;
}

.custom-galleria .p-galleria-thumbnail-item:hover {
  opacity: 1;
}

@media (max-width: 1024px) {
  .sermons-container {
    padding: 1rem;
  }
  
  iframe {
    height: 300px;
  }
}

.mobile-sermon-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.mobile-sermon-counter {
  margin: 0;
  flex: 1;
  text-align: center;
}

.mobile-sermon-select {
  width: 100%;
  background: #111827;
  color: #f9fafb;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  padding: 0.875rem 1rem;
  font-size: 1rem;
}

.mobile-sermon-select:focus {
  outline: none;
  border-color: #60a5fa;
  box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
}

/* Social Media Button Styles */
.p-button-facebook {
  color: #1877f2 !important;
}

.p-button-facebook:hover {
  background-color: #1877f2 !important;
  color: white !important;
}

.p-button-twitter {
  color: #1da1f2 !important;
}

.p-button-twitter:hover {
  background-color: #1da1f2 !important;
  color: white !important;
}

.p-button-whatsapp {
  color: #25d366 !important;
}

.p-button-whatsapp:hover {
  background-color: #25d366 !important;
  color: white !important;
}

.p-button-secondary {
  color: #6c757d !important;
}

.p-button-secondary:hover {
  background-color: #6c757d !important;
  color: white !important;
}
</style>