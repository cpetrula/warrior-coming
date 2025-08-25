<template>
  <div class="admin-container p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Sermon Administration</h1>
    
    <!-- Upload Form -->
    <Card class="mb-6">
      <template #title>
        <div class="flex justify-between items-center">
          <span>Upload New Sermon</span>
          <Button 
            :icon="showUploadForm ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
            @click="showUploadForm = !showUploadForm"
            text
            :aria-label="showUploadForm ? 'Collapse upload form' : 'Expand upload form'"
          />
        </div>
      </template>
      <template #content>
        <div v-show="showUploadForm">
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
            <label for="description" class="block text-sm font-medium mb-2">Description (3-4 sentences)</label>
            <Textarea 
              id="description"
              v-model="newSermon.description" 
              placeholder="Enter a brief description of the sermon (3-4 sentences)"
              rows="4"
              class="w-full"
            />
            <small class="text-gray-500">Brief description limited to 3-4 sentences</small>
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

          <div class="field">
            <label for="notesFile" class="block text-sm font-medium mb-2">Sermon Notes PDF (Optional)</label>
            <FileUpload 
              id="notesFile"
              ref="notesUpload"
              mode="basic" 
              accept="application/pdf"
              :maxFileSize="50000000"
              customUpload
              @select="onNotesSelect"
              chooseLabel="Choose PDF Notes"
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
        </div>
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
          listStyle="max-height:100%;"
          dataKey="id"
          @reorder="updateOrder"
        >
          <template #item="{ item: sermon, index }">
            <div class="sermon-item flex items-center justify-between p-4 border rounded w-full">
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
                  <h3 class="font-bold text-lg text-black">{{ sermon.title }}</h3>
                  <p class="text-sm text-gray-600">{{ formatDate(sermon.date) }}</p>
                  <div v-if="sermon.description" class="text-sm text-gray-500 mt-1">
                    {{ sermon.description.length > 100 ? sermon.description.substring(0, 100) + '...' : sermon.description }}
                  </div>
                  <div v-if="sermon.notesFile" class="mt-1">
                    <a :href="`/uploads/${sermon.notesFile}`" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm">
                      <i class="pi pi-file-pdf mr-1"></i>View Sermon Notes (PDF)
                    </a>
                  </div>
                
                  <div class="mt-2">
                    <audio controls class="w-full max-w-md">
                      <source :src="`/uploads/${sermon.audioFile}`" type="audio/mpeg">
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              </div>
              
              <div class="sermon-actions flex space-x-2">
                <Button 
                  icon="pi pi-pencil" 
                  severity="secondary"
                  rounded
                  @click="startEdit(sermon)"
                  :disabled="editing !== null"
                  title="Edit sermon"
                />
                <Button 
                  icon="pi pi-trash" 
                  severity="danger"
                  rounded
                  @click="deleteSermon(sermon.id)"
                  :loading="deleting === sermon.id"
                  title="Delete sermon"
                />
              </div>
            </div>
          </template>
        </OrderList>
      </template>
    </Card>

    <!-- Edit Sermon Dialog -->
    <Dialog 
      v-model:visible="showEditDialog" 
      modal 
      header="Edit Sermon" 
      :style="{ width: '50rem' }" 
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <form @submit.prevent="updateSermon" class="grid grid-cols-1 gap-4">
        <div class="field">
          <label for="editTitle" class="block text-sm font-medium mb-2">Title *</label>
          <InputText 
            id="editTitle"
            v-model="editingSermon.title" 
            placeholder="Enter sermon title"
            class="w-full"
            :class="{ 'p-invalid': editErrors.title }"
            required 
          />
          <small v-if="editErrors.title" class="p-error">{{ editErrors.title }}</small>
        </div>
        
        <div class="field">
          <label for="editDate" class="block text-sm font-medium mb-2">Date *</label>
          <Calendar 
            id="editDate"
            v-model="editingSermon.date" 
            dateFormat="yy-mm-dd"
            placeholder="Select date"
            class="w-full"
            :class="{ 'p-invalid': editErrors.date }"
            required
          />
          <small v-if="editErrors.date" class="p-error">{{ editErrors.date }}</small>
        </div>
        
        <div class="field">
          <label for="editDescription" class="block text-sm font-medium mb-2">Description (3-4 sentences)</label>
          <Textarea 
            id="editDescription"
            v-model="editingSermon.description" 
            placeholder="Enter a brief description of the sermon (3-4 sentences)"
            rows="4"
            class="w-full"
          />
        </div>
        
        <div class="field">
          <label for="editAudioFile" class="block text-sm font-medium mb-2">Audio File (Optional - leave empty to keep current)</label>
          <FileUpload 
            id="editAudioFile"
            mode="basic" 
            accept="audio/*"
            :maxFileSize="100000000"
            customUpload
            @select="onEditAudioSelect"
            chooseLabel="Choose New Audio File"
          />
        </div>
        
        <div class="field">
          <label for="editImageFile" class="block text-sm font-medium mb-2">Image (Optional - leave empty to keep current)</label>
          
          <!-- Show current image if exists -->
          <div v-if="currentSermonImage && !imageDeleted" class="mb-3 p-3 border rounded">
            <div class="flex items-center justify-between">
              <span class="text-sm text-gray-600">Current image: {{ currentSermonImage }}</span>
              <Button 
                label="Remove Image" 
                icon="pi pi-trash" 
                @click="removeCurrentImage"
                size="small"
                severity="danger"
                outlined
              />
            </div>
          </div>
          
          <!-- Show message if image was deleted -->
          <div v-if="imageDeleted" class="mb-3 p-3 border rounded bg-yellow-50">
            <span class="text-sm text-yellow-700">Image will be removed when you save</span>
          </div>
          
          <FileUpload 
            id="editImageFile"
            mode="basic" 
            accept="image/*"
            :maxFileSize="10000000"
            customUpload
            @select="onEditImageSelect"
            chooseLabel="Choose New Image"
          />
        </div>

        <div class="field">
          <label for="editNotesFile" class="block text-sm font-medium mb-2">Sermon Notes PDF (Optional - leave empty to keep current)</label>
          <FileUpload 
            id="editNotesFile"
            mode="basic" 
            accept="application/pdf"
            :maxFileSize="50000000"
            customUpload
            @select="onEditNotesSelect"
            chooseLabel="Choose New PDF Notes"
          />
        </div>
      </form>
      
      <template #footer>
        <Button 
          label="Cancel" 
          icon="pi pi-times" 
          @click="cancelEdit" 
          text 
        />
        <Button 
          label="Update" 
          icon="pi pi-check" 
          @click="updateSermon"
          :loading="uploading"
        />
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import Calendar from 'primevue/calendar'
import Textarea from 'primevue/textarea'
import FileUpload from 'primevue/fileupload'
import Button from 'primevue/button'
import OrderList from 'primevue/orderlist'
import Image from 'primevue/image'
import ProgressSpinner from 'primevue/progressspinner'
import Dialog from 'primevue/dialog'

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
const loading = ref(false)
const uploading = ref(false)
const deleting = ref<string | null>(null)
const editing = ref<string | null>(null)
const showUploadForm = ref(false)
const showEditDialog = ref(false)

const newSermon = ref({
  title: '',
  date: null as Date | null,
  description: ''
})

const editingSermon = ref({
  id: '',
  title: '',
  date: null as Date | null,
  description: ''
})

const selectedAudioFile = ref<File | null>(null)
const selectedImageFile = ref<File | null>(null)
const selectedNotesFile = ref<File | null>(null)
const selectedEditAudioFile = ref<File | null>(null)
const selectedEditImageFile = ref<File | null>(null)
const selectedEditNotesFile = ref<File | null>(null)
const currentSermonImage = ref<string | null>(null)
const imageDeleted = ref(false)

const errors = ref({
  title: '',
  date: '',
  audioFile: ''
})

const editErrors = ref({
  title: '',
  date: ''
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

const onNotesSelect = (event: any) => {
  selectedNotesFile.value = event.files[0]
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
    
    if (selectedNotesFile.value) {
      formData.append('notesFile', selectedNotesFile.value)
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
    selectedNotesFile.value = null
    
    // Clear file uploads
    const audioUpload = document.querySelector('#audioFile input') as HTMLInputElement
    const imageUpload = document.querySelector('#imageFile input') as HTMLInputElement
    const notesUpload = document.querySelector('#notesFile input') as HTMLInputElement
    if (audioUpload) audioUpload.value = ''
    if (imageUpload) imageUpload.value = ''
    if (notesUpload) notesUpload.value = ''
    
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

const onEditAudioSelect = (event: any) => {
  selectedEditAudioFile.value = event.files[0]
}

const onEditImageSelect = (event: any) => {
  selectedEditImageFile.value = event.files[0]
  imageDeleted.value = false // Reset deletion flag when new image is selected
}

const onEditNotesSelect = (event: any) => {
  selectedEditNotesFile.value = event.files[0]
}

const startEdit = (sermon: Sermon) => {
  editing.value = sermon.id
  showEditDialog.value = true
  editingSermon.value = {
    id: sermon.id,
    title: sermon.title,
    date: new Date(sermon.date),
    description: sermon.description || ''
  }
  selectedEditAudioFile.value = null
  selectedEditImageFile.value = null
  selectedEditNotesFile.value = null
  currentSermonImage.value = sermon.imageFile || null
  imageDeleted.value = false
  editErrors.value = { title: '', date: '' }
}

const cancelEdit = () => {
  editing.value = null
  showEditDialog.value = false
  editingSermon.value = { id: '', title: '', date: null, description: '' }
  selectedEditAudioFile.value = null
  selectedEditImageFile.value = null
  selectedEditNotesFile.value = null
  currentSermonImage.value = null
  imageDeleted.value = false
  editErrors.value = { title: '', date: '' }
}

const removeCurrentImage = async () => {
  if (!confirm('Are you sure you want to remove the current image?')) return
  
  try {
    uploading.value = true
    await axios.delete(`/api/sermons/${editingSermon.value.id}/image`)
    imageDeleted.value = true
    currentSermonImage.value = null
  } catch (error) {
    console.error('Error removing image:', error)
    alert('Failed to remove image. Please try again.')
  } finally {
    uploading.value = false
  }
}

const validateEditForm = () => {
  editErrors.value = { title: '', date: '' }
  
  if (!editingSermon.value.title.trim()) {
    editErrors.value.title = 'Title is required'
  }
  
  if (!editingSermon.value.date) {
    editErrors.value.date = 'Date is required'
  }
  
  return Object.values(editErrors.value).every(error => error === '')
}

const updateSermon = async () => {
  if (!validateEditForm()) return
  
  uploading.value = true
  
  try {
    const formData = new FormData()
    formData.append('title', editingSermon.value.title)
    formData.append('date', editingSermon.value.date!.toISOString().split('T')[0])
    formData.append('description', editingSermon.value.description)
    
    if (selectedEditAudioFile.value) {
      formData.append('audioFile', selectedEditAudioFile.value)
    }
    
    if (selectedEditImageFile.value) {
      formData.append('imageFile', selectedEditImageFile.value)
    }
    
    if (selectedEditNotesFile.value) {
      formData.append('notesFile', selectedEditNotesFile.value)
    }
    
    await axios.put(`/api/sermons/${editingSermon.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    cancelEdit()
    await loadSermons()
  } catch (error) {
    console.error('Error updating sermon:', error)
    alert('Failed to update sermon. Please try again.')
  } finally {
    uploading.value = false
  }
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
.p-listbox-list-container {
    overflow: none;
}
</style>