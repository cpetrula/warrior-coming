<template>
  <div class="admin-container p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Sermon Administration</h1>
    
    <!-- Upload Form -->
    <Card class="mb-6">
      <template #title>Upload New Sermon</template>
      <template #content>
        <form @submit.prevent="uploadSermon" class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="field">
            <label for="title" class="block text-sm font-medium mb-2">Title *</label>
            <InputText 
              id="title"
              v-model="newSermon.title" 
              placeholder="Enter sermon title"
              class="w-full"
              :class="{ 'p-invalid': errors.title }"
              required 
            />
            <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
          </div>
          
          <div class="field">
            <label for="date" class="block text-sm font-medium mb-2">Date *</label>
            <Calendar 
              id="date"
              v-model="newSermon.date" 
              dateFormat="yy-mm-dd"
              placeholder="Select date"
              class="w-full"
              :class="{ 'p-invalid': errors.date }"
              required
            />
            <small v-if="errors.date" class="p-error">{{ errors.date }}</small>
          </div>
          
          <div class="field md:col-span-2">
            <label for="description" class="block text-sm font-medium mb-2">Description</label>
            <Editor 
              id="description"
              v-model="newSermon.description" 
              placeholder="Enter sermon description (optional)"
              editorStyle="height: 200px"
              class="w-full"
            />
            <small class="text-gray-500">{{ getTextLength(newSermon.description) }}/5000 characters</small>
          </div>
          
          <div class="field">
            <label for="audioFile" class="block text-sm font-medium mb-2">Audio File *</label>
            <FileUpload 
              id="audioFile"
              ref="audioUpload"
              mode="basic" 
              accept="audio/*"
              :maxFileSize="100000000"
              customUpload
              @select="onAudioSelect"
              :class="{ 'p-invalid': errors.audioFile }"
              chooseLabel="Choose Audio File"
            />
            <small v-if="errors.audioFile" class="p-error">{{ errors.audioFile }}</small>
          </div>
          
          <div class="field">
            <label for="imageFile" class="block text-sm font-medium mb-2">Image (Optional)</label>
            <FileUpload 
              id="imageFile"
              ref="imageUpload"
              mode="basic" 
              accept="image/*"
              :maxFileSize="10000000"
              customUpload
              @select="onImageSelect"
              chooseLabel="Choose Image"
            />
          </div>
          
          <div class="md:col-span-2">
            <Button 
              type="submit" 
              label="Upload Sermon" 
              :loading="uploading"
              :disabled="!isFormValid"
              class="w-full md:w-auto"
            />
          </div>
        </form>
      </template>
    </Card>
    
    <!-- Sermons List -->
    <Card>
      <template #title>
        <div class="flex justify-between items-center">
          <span>Uploaded Sermons</span>
          <Button 
            icon="pi pi-refresh" 
            @click="loadSermons"
            :loading="loading"
            text
          />
        </div>
      </template>
      <template #content>
        <div v-if="loading" class="text-center py-4">
          <ProgressSpinner />
        </div>
        
        <div v-else-if="sermons.length === 0" class="text-center py-8 text-gray-500">
          No sermons uploaded yet.
        </div>
        
        <OrderList 
          v-else
          v-model="sermons" 
          listStyle="height:auto"
          dataKey="id"
          @reorder="updateOrder"
        >
          <template #item="{ item: sermon, index }">
            <div class="sermon-item flex items-center justify-between p-4 border rounded">
              <div class="flex items-center space-x-4">
                <div v-if="sermon.imageFile" class="sermon-image">
                  <Image 
                    :src="`/uploads/${sermon.imageFile}`" 
                    alt="Sermon Image"
                    width="60"
                    height="60"
                    class="rounded"
                  />
                </div>
                <div v-else class="sermon-placeholder w-15 h-15 bg-gray-300 rounded flex items-center justify-center">
                  <i class="pi pi-image text-gray-500"></i>
                </div>
                
                <div class="sermon-details flex-1">
                  <h3 class="font-bold text-lg">{{ sermon.title }}</h3>
                  <p class="text-sm text-gray-600">{{ formatDate(sermon.date) }}</p>
                  <p v-if="sermon.description" class="text-sm text-gray-500 mt-1">
                    {{ sermon.description.substring(0, 100) }}{{ sermon.description.length > 100 ? '...' : '' }}
                  </p>
                  <div class="mt-2">
                    <div class="audio-player-wrapper bg-gray-100 p-3 rounded-lg">
                      <audio 
                        controls 
                        class="w-full max-w-md sermon-audio"
                        preload="metadata"
                        :data-title="sermon.title"
                      >
                        <source :src="`/uploads/${sermon.audioFile}`" type="audio/mpeg">
                        Your browser does not support the audio element.
                      </audio>
                      <div class="audio-info text-xs text-gray-600 mt-1">
                        <i class="pi pi-volume-up mr-1"></i>
                        Click to play • {{ sermon.title }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="sermon-actions">
                <Button 
                  icon="pi pi-trash" 
                  severity="danger"
                  text
                  @click="deleteSermon(sermon.id)"
                  :loading="deleting === sermon.id"
                />
              </div>
            </div>
          </template>
        </OrderList>
      </template>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Editor from 'primevue/editor'
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'
import OrderList from 'primevue/orderlist'
import Image from 'primevue/image'
import ProgressSpinner from 'primevue/progressspinner'

interface Sermon {
  id: string
  title: string
  date: string
  description?: string
  audioFile: string
  imageFile?: string
  order: number
  createdAt: string
}

// Reactive data
const sermons = ref<Sermon[]>([])
const loading = ref(false)
const uploading = ref(false)
const deleting = ref<string | null>(null)

const newSermon = ref({
  title: '',
  date: null as Date | null,
  description: ''
})

const selectedAudioFile = ref<File | null>(null)
const selectedImageFile = ref<File | null>(null)

const errors = ref({
  title: '',
  date: '',
  audioFile: ''
})

// Computed properties
const isFormValid = computed(() => {
  return newSermon.value.title.trim() !== '' && 
         newSermon.value.date !== null && 
         selectedAudioFile.value !== null
})

// Methods
const validateForm = () => {
  errors.value = { title: '', date: '', audioFile: '' }
  
  if (!newSermon.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (!newSermon.value.date) {
    errors.value.date = 'Date is required'
  }
  
  if (!selectedAudioFile.value) {
    errors.value.audioFile = 'Audio file is required'
  }
  
  return Object.values(errors.value).every(error => error === '')
}

const onAudioSelect = (event: any) => {
  selectedAudioFile.value = event.files[0]
  errors.value.audioFile = ''
}

const onImageSelect = (event: any) => {
  selectedImageFile.value = event.files[0]
}

const uploadSermon = async () => {
  if (!validateForm()) return
  
  uploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('title', newSermon.value.title)
    formData.append('date', newSermon.value.date!.toISOString().split('T')[0])
    formData.append('description', newSermon.value.description)
    formData.append('audioFile', selectedAudioFile.value!)
    
    if (selectedImageFile.value) {
      formData.append('imageFile', selectedImageFile.value)
    }
    
    await axios.post('/api/sermons', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Reset form
    newSermon.value = { title: '', date: null, description: '' }
    selectedAudioFile.value = null
    selectedImageFile.value = null
    
    // Clear file uploads
    const audioUpload = document.querySelector('#audioFile input') as HTMLInputElement
    const imageUpload = document.querySelector('#imageFile input') as HTMLInputElement
    if (audioUpload) audioUpload.value = ''
    if (imageUpload) imageUpload.value = ''
    
    await loadSermons()
  } catch (error) {
    console.error('Error uploading sermon:', error)
    alert('Failed to upload sermon. Please try again.')
  } finally {
    uploading.value = false
  }
}

const loadSermons = async () => {
  loading.value = true
  try {
    const response = await axios.get('/api/sermons')
    sermons.value = response.data
  } catch (error) {
    console.error('Error loading sermons:', error)
  } finally {
    loading.value = false
  }
}

const updateOrder = async () => {
  try {
    const sermonIds = sermons.value.map(sermon => sermon.id)
    await axios.patch('/api/sermons/reorder', { sermonIds })
  } catch (error) {
    console.error('Error updating order:', error)
    await loadSermons() // Reload on error
  }
}

const deleteSermon = async (id: string) => {
  if (!confirm('Are you sure you want to delete this sermon?')) return
  
  deleting.value = id
  try {
    await axios.delete(`/api/sermons/${id}`)
    await loadSermons()
  } catch (error) {
    console.error('Error deleting sermon:', error)
    alert('Failed to delete sermon. Please try again.')
  } finally {
    deleting.value = null
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

// Helper function to get text length from HTML content
const getTextLength = (htmlContent: string) => {
  if (!htmlContent) return 0
  // Create a temporary div to extract text content from HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  return tempDiv.textContent?.length || 0
}

// Lifecycle
onMounted(() => {
  loadSermons()
})
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(to bottom, #000, #1a1a1a);
}

.sermon-item {
  background: white;
  border: 1px solid #e5e7eb;
}

.sermon-item:hover {
  background: #f9fafb;
}

.field {
  margin-bottom: 1rem;
}

.p-invalid {
  border-color: #ef4444 !important;
}

.p-error {
  color: #ef4444;
  font-size: 0.875rem;
}

.audio-player-wrapper {
  border: 1px solid #d1d5db;
  background: linear-gradient(to bottom, #f9fafb, #f3f4f6);
}

.sermon-audio {
  border-radius: 4px;
}

.sermon-audio:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.audio-info {
  display: flex;
  align-items: center;
  font-weight: 500;
}
</style>