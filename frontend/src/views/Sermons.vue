<template>
  <div class="sermons-container p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Sermons</h1>
    
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
      <!-- Sermons List -->
      <div class="lg:col-span-1">
        <Card class="h-fit">
          <template #title>
            <span class="text-lg font-semibold">Available Sermons</span>
          </template>
          <template #content>
            <div class="space-y-3">
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
                  <!-- Sermon Image or Placeholder -->
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
                  
                  <!-- Sermon Details -->
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
      
      <!-- Selected Sermon Player -->
      <div class="lg:col-span-2">
        <div v-if="selectedSermon" class="space-y-6">
          <!-- Sermon Header -->
          <Card>
            <template #title>
              <div class="flex items-center space-x-4">
                <Image 
                  v-if="selectedSermon.imageFile"
                  :src="`/uploads/${selectedSermon.imageFile}`" 
                  alt="Sermon Image"
                  width="80"
                  height="80"
                  class="rounded"
                />
                <div>
                  <h2 class="text-xl font-bold text-gray-900">{{ selectedSermon.title }}</h2>
                  <p class="text-gray-600">{{ formatDate(selectedSermon.date) }}</p>
                </div>
              </div>
            </template>
            <template #content>
              <p v-if="selectedSermon.description" class="text-gray-700">
                {{ selectedSermon.description }}
              </p>
            </template>
          </Card>
          
          <!-- Audio Player -->
          <Card>
            <template #title>
              <span class="text-lg font-semibold flex items-center">
                <i class="pi pi-play mr-2"></i>
                Audio
              </span>
            </template>
            <template #content>
              <audio controls class="w-full">
                <source :src="`/uploads/${selectedSermon.audioFile}`" type="audio/mpeg">
                <source :src="`/uploads/${selectedSermon.audioFile}`" type="audio/wav">
                <source :src="`/uploads/${selectedSermon.audioFile}`" type="audio/ogg">
                Your browser does not support the audio element.
              </audio>
            </template>
          </Card>
          
          <!-- PDF Notes Viewer -->
          <Card v-if="selectedSermon.notesFile">
            <template #title>
              <span class="text-lg font-semibold flex items-center">
                <i class="pi pi-file-pdf mr-2"></i>
                Sermon Notes
              </span>
            </template>
            <template #content>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <p class="text-gray-600">View or download the sermon notes PDF</p>
                  <Button 
                    icon="pi pi-download" 
                    label="Download PDF"
                    size="small"
                    outlined
                    @click="downloadPDF"
                  />
                </div>
                <iframe 
                  :src="`/uploads/${selectedSermon.notesFile}`"
                  class="w-full h-96 border rounded"
                  title="Sermon Notes PDF"
                />
              </div>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import Button from 'primevue/button'
import Image from 'primevue/image'
import ProgressSpinner from 'primevue/progressspinner'

interface Sermon {
  id: string
  title: string
  date: string
  description?: string
  audioFile: string
  imageFile?: string
  notesFile?: string
  order: number
  createdAt: string
}

// Reactive data
const sermons = ref<Sermon[]>([])
const selectedSermon = ref<Sermon | null>(null)
const loading = ref(false)

// Methods
const loadSermons = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/sermons')
    sermons.value = response.data
    
    // Auto-select the first sermon if available
    if (sermons.value.length > 0 && !selectedSermon.value) {
      selectedSermon.value = sermons.value[0]
    }
  } catch (error) {
    console.error('Error loading sermons:', error)
  } finally {
    loading.value = false
  }
}

const selectSermon = (sermon: Sermon) => {
  selectedSermon.value = sermon
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

const downloadPDF = () => {
  if (selectedSermon.value?.notesFile) {
    const link = document.createElement('a')
    link.href = `/uploads/${selectedSermon.value.notesFile}`
    link.download = `${selectedSermon.value.title} - Notes.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// Lifecycle
onMounted(() => {
  loadSermons()
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

@media (max-width: 1024px) {
  .sermons-container {
    padding: 1rem;
  }
  
  iframe {
    height: 300px;
  }
}
</style>