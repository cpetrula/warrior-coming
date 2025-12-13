<template>
  <div class="admin-container p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-white">Administration</h1>
      <Button 
        v-if="isAuthenticated" 
        @click="logout" 
        icon="pi pi-sign-out" 
        label="Logout" 
        text 
        class="text-white"
      />
    </div>
    
    <!-- Login Form -->
    <div v-if="!isAuthenticated" class="flex justify-center items-center min-h-[60vh]">
      <Card class="w-full max-w-md">
        <template #title>
          <div class="text-center">
            <h2 class="text-2xl font-bold">Admin Login</h2>
          </div>
        </template>
        <template #content>
          <form @submit.prevent="authenticateAdmin" class="space-y-4">
            <div class="field">
              <label for="adminPassword" class="block text-sm font-medium mb-2">Password</label>
              <Password 
                id="adminPassword"
                v-model="loginPassword"
                placeholder="Enter admin password"
                class="w-full"
                :class="{ 'p-invalid': loginError }"
                :feedback="false"
                toggleMask
                required
              />
              <small v-if="loginError" class="p-error">{{ loginError }}</small>
            </div>
            
            <Button 
              type="submit" 
              label="Login" 
              class="w-full"
              :loading="authenticating"
              :disabled="authenticating"
            />
          </form>
        </template>
      </Card>
    </div>
    
    <!-- Admin Content (only shown when authenticated) -->
    <div v-if="isAuthenticated">
    <Tabs value="0">
       <TabList>
        <Tab value="0">Blogs</Tab>
        <Tab value="1">Music</Tab>
        <Tab value="2">Sermons</Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0">
        <!-- Blog Upload Form -->
        <Card class="mb-6">
          <template #title>
            <div class="flex justify-between items-center">
              <span>Create New Blog</span>
              <Button 
                :icon="showBlogForm ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                @click="showBlogForm = !showBlogForm"
                text
                :aria-label="showBlogForm ? 'Collapse blog form' : 'Expand blog form'"
              />
            </div>
          </template>
          <template #content>
            <div v-show="showBlogForm">
              <form @submit.prevent="createBlog" class="grid grid-cols-1 gap-4">
                <div class="field">
                  <label for="blogTitle" class="block text-sm font-medium mb-2">Title *</label>
                  <InputText 
                    id="blogTitle"
                    v-model="newBlog.title" 
                    placeholder="Enter blog title"
                    class="w-full"
                    :class="{ 'p-invalid': blogErrors.title }"
                    required 
                  />
                  <small v-if="blogErrors.title" class="p-error">{{ blogErrors.title }}</small>
                </div>
                
                <div class="field">
                  <label for="blogDate" class="block text-sm font-medium mb-2">Date *</label>
                  <Calendar 
                    id="blogDate"
                    v-model="newBlog.date" 
                    dateFormat="yy-mm-dd"
                    placeholder="Select date"
                    class="w-full"
                    :class="{ 'p-invalid': blogErrors.date }"
                    required
                  />
                  <small v-if="blogErrors.date" class="p-error">{{ blogErrors.date }}</small>
                </div>
                
                <div class="field">
                  <label for="blogContent" class="block text-sm font-medium mb-2">Content *</label>
                  <Textarea 
                    id="blogContent"
                    v-model="newBlog.content"
                    placeholder="Write your blog content here..."
                    :class="{ 'p-invalid': blogErrors.content }"
                    rows="12"
                    class="w-full"
                  />
                  <small v-if="blogErrors.content" class="p-error">{{ blogErrors.content }}</small>
                </div>
                
                <div class="flex gap-4">
                  <Button 
                    type="submit" 
                    label="Create Blog" 
                    icon="pi pi-plus"
                    :loading="uploadingBlog"
                    :disabled="uploadingBlog"
                  />
                  <Button 
                    type="button" 
                    label="Clear" 
                    icon="pi pi-times"
                    severity="secondary"
                    @click="clearBlogForm"
                  />
                </div>
              </form>
            </div>
          </template>
        </Card>

        <!-- Blog List -->
        <Card>
          <template #title>
            <span>Manage Blogs</span>
          </template>
          <template #content>
            <div v-if="loadingBlogs" class="text-center py-8">
              <ProgressSpinner />
              <p class="mt-4 text-gray-500">Loading blogs...</p>
            </div>
            
            <div v-else-if="blogs.length === 0" class="text-center py-8 text-gray-500">
              No blogs found. Create your first blog above.
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="blog in blogs" 
                :key="blog.id"
                class="border border-gray-200 rounded-lg p-4 bg-white"
              >
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold text-gray-900">{{ blog.title }}</h3>
                    <p class="text-sm text-gray-500 mb-2">{{ formatDate(blog.date) }}</p>
                    <div class="text-sm text-gray-700 prose prose-sm max-w-none" v-html="blog.content.substring(0, 200) + (blog.content.length > 200 ? '...' : '')"></div>
                  </div>
                  <div class="flex gap-2 ml-4">
                    <Button 
                      icon="pi pi-pencil" 
                      size="small"
                      outlined
                      @click="editBlog(blog)"
                      :aria-label="`Edit ${blog.title}`"
                    />
                    <Button 
                      icon="pi pi-trash" 
                      size="small"
                      severity="danger"
                      outlined
                      @click="deleteBlog(blog.id)"
                      :loading="deletingBlog === blog.id"
                      :aria-label="`Delete ${blog.title}`"
                    />
                  </div>
                </div>
              </div>
            </div>
          </template>
        </Card>
      </TabPanel>
      
      <TabPanel value="1">
        <!-- Music Upload Form -->
        <Card class="mb-6">
          <template #title>
            <div class="flex justify-between items-center">
              <span>Upload New Music</span>
              <Button 
                :icon="showMusicForm ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
                @click="showMusicForm = !showMusicForm"
                text
                :aria-label="showMusicForm ? 'Collapse music form' : 'Expand music form'"
              />
            </div>
          </template>
          <template #content>
            <div v-show="showMusicForm">
              <form @submit.prevent="createMusic" class="grid grid-cols-1 gap-4">
                <div class="field">
                  <label for="musicTitle" class="block text-sm font-medium mb-2">Title *</label>
                  <InputText 
                    id="musicTitle"
                    v-model="newMusic.title" 
                    placeholder="Enter music title"
                    class="w-full"
                    :class="{ 'p-invalid': musicErrors.title }"
                    required 
                  />
                  <small v-if="musicErrors.title" class="p-error">{{ musicErrors.title }}</small>
                </div>
                
                <div class="field">
                  <label for="musicFile" class="block text-sm font-medium mb-2">Music File *</label>
                  <FileUpload 
                    id="musicFile"
                    mode="basic" 
                    accept="audio/*"
                    :maxFileSize="100000000"
                    customUpload
                    @select="onMusicSelect"
                    chooseLabel="Choose Music File"
                    :class="{ 'p-invalid': musicErrors.musicFile }"
                  />
                  <small v-if="musicErrors.musicFile" class="p-error">{{ musicErrors.musicFile }}</small>
                </div>
                
                <div class="flex gap-2">
                  <Button 
                    type="submit" 
                    label="Upload Music" 
                    icon="pi pi-upload"
                    :loading="uploadingMusic"
                    :disabled="!newMusic.title.trim() || !selectedMusicFile"
                  />
                  <Button 
                    type="button" 
                    label="Cancel" 
                    severity="secondary"
                    @click="showMusicForm = false"
                    :disabled="uploadingMusic"
                  />
                </div>
              </form>
            </div>
          </template>
        </Card>

        <!-- Music List -->
        <Card>
          <template #title>
            <span>Music Library ({{ music.length }} items)</span>
          </template>
          <template #content>
            <div v-if="loadingMusic" class="flex justify-center py-8">
              <ProgressSpinner />
            </div>
            
            <div v-else-if="music.length === 0" class="text-center py-8 text-gray-500">
              No music uploaded yet. Use the form above to upload your first music file.
            </div>
            
            <div v-else class="space-y-4">
              <div 
                v-for="musicItem in music" 
                :key="musicItem.id"
                class="flex items-center justify-between p-4 border rounded-lg bg-white"
              >
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ musicItem.title }}</h3>
                  
                  <div class="mt-2">
                    <audio controls class="w-full max-w-md">
                      <source :src="`/uploads/${musicItem.musicFile}`" type="audio/mpeg">
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
                
                <div class="flex gap-2 ml-4">
                  <Button 
                    icon="pi pi-pencil" 
                    size="small"
                    outlined
                    @click="editMusic(musicItem)"
                    :aria-label="`Edit ${musicItem.title}`"
                  />
                  <Button 
                    icon="pi pi-trash" 
                    size="small"
                    severity="danger"
                    outlined
                    @click="deleteMusic(musicItem.id)"
                    :loading="deletingMusic === musicItem.id"
                    :aria-label="`Delete ${musicItem.title}`"
                  />
                </div>
              </div>
            </div>
          </template>
        </Card>
      </TabPanel>
      
      <TabPanel value="2">
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
              
              <div class="field md:col-span-2">
                <label for="youtubeId" class="block text-sm font-medium mb-2">YouTube Video ID (Optional)</label>
                <InputText 
                  id="youtubeId"
                  v-model="newSermon.youtubeId" 
                  placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ)"
                  class="w-full"
                  :class="{ 'p-invalid': errors.youtubeId }"
                />
                <small v-if="errors.youtubeId" class="p-error">{{ errors.youtubeId }}</small>
                <small v-else class="text-gray-500">Enter just the video ID from the YouTube URL, not the full URL</small>
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
                <label for="imageFiles" class="block text-sm font-medium mb-2">Additional Images (Optional - up to 10)</label>
                <FileUpload 
                  id="imageFiles"
                  ref="imageFilesUpload"
                  mode="basic" 
                  accept="image/*"
                  :maxFileSize="10000000"
                  multiple
                  customUpload
                  @select="onImageFilesSelect"
                  chooseLabel="Choose Multiple Images"
                />
                <small v-if="selectedImageFiles.length > 0" class="text-green-600">
                  {{ selectedImageFiles.length }} image(s) selected
                </small>
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
            
            <div v-else class="space-y-4">
              <div v-for="(sermon, index) in sermons" :key="sermon.id" class="sermon-item flex items-center justify-between p-4 border rounded w-full bg-white">
                <div class="flex items-center space-x-4">
                  <!-- Primary image (legacy) -->
                  <div v-if="sermon.imageFile" class="sermon-image">
                    <Image 
                      :src="`/uploads/${sermon.imageFile}`" 
                      alt="Sermon Image"
                      width="60"
                      height="60"
                      class="rounded"
                    />
                  </div>
                  <!-- Multiple images preview -->
                  <div v-else-if="sermon.images && sermon.images.length > 0" class="sermon-images flex space-x-2">
                    <div v-for="(image, idx) in sermon.images.slice(0, 3)" :key="image.id" class="relative">
                      <Image 
                        :src="`/uploads/${image.imageFile}`" 
                        alt="Sermon Image"
                        width="60"
                        height="60"
                        class="rounded"
                      />
                      <div v-if="idx === 2 && sermon.images.length > 3" 
                           class="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center text-white text-sm">
                        +{{ sermon.images.length - 3 }}
                      </div>
                    </div>
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
            </div>
          </template>
        </Card>
      </TabPanel>
    </TabPanels>
    </Tabs>

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
          <label for="editYoutubeId" class="block text-sm font-medium mb-2">YouTube Video ID (Optional)</label>
          <InputText 
            id="editYoutubeId"
            v-model="editingSermon.youtubeId" 
            placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ)"
            class="w-full"
            :class="{ 'p-invalid': editErrors.youtubeId }"
          />
          <small v-if="editErrors.youtubeId" class="p-error">{{ editErrors.youtubeId }}</small>
          <small v-else class="text-gray-500">Enter just the video ID from the YouTube URL, not the full URL</small>
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
              <span class="text-sm text-gray-600">Current image: <img :src="`/uploads/${currentSermonImage}`" style="width:150px"/></span>
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

        <!-- Display existing multiple images -->
        <div v-if="editingSermon.images && editingSermon.images.length > 0" class="field">
          <label class="block text-sm font-medium mb-2">Current Additional Images</label>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="image in editingSermon.images" :key="image.id" class="relative border rounded p-2">
              <img :src="`/uploads/${image.imageFile}`" alt="Sermon Image" class="w-full h-24 object-cover rounded" />
              <Button 
                icon="pi pi-trash" 
                size="small"
                severity="danger"
                rounded
                @click="deleteSermonImage(image.id)"
                class="absolute top-1 right-1"
                title="Delete this image"
              />
            </div>
          </div>
        </div>

        <div class="field">
          <label for="editImageFiles" class="block text-sm font-medium mb-2">Add More Images (Optional - up to 10 total)</label>
          <FileUpload 
            id="editImageFiles"
            mode="basic" 
            accept="image/*"
            :maxFileSize="10000000"
            multiple
            customUpload
            @select="onEditImageFilesSelect"
            chooseLabel="Choose Additional Images"
          />
          <small v-if="selectedEditImageFiles.length > 0" class="text-green-600">
            {{ selectedEditImageFiles.length }} new image(s) selected
          </small>
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

    <!-- Edit Blog Dialog -->
    <Dialog 
      v-model:visible="showEditBlogDialog" 
      modal 
      header="Edit Blog" 
      :style="{ width: '50rem' }" 
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <form @submit.prevent="updateBlog" class="grid grid-cols-1 gap-4">
        <div class="field">
          <label for="editBlogTitle" class="block text-sm font-medium mb-2">Title *</label>
          <InputText 
            id="editBlogTitle"
            v-model="editingBlog.title" 
            placeholder="Enter blog title"
            class="w-full"
            :class="{ 'p-invalid': editBlogErrors.title }"
            required 
          />
          <small v-if="editBlogErrors.title" class="p-error">{{ editBlogErrors.title }}</small>
        </div>
        
        <div class="field">
          <label for="editBlogDate" class="block text-sm font-medium mb-2">Date *</label>
          <Calendar 
            id="editBlogDate"
            v-model="editingBlog.date" 
            dateFormat="yy-mm-dd"
            placeholder="Select date"
            class="w-full"
            :class="{ 'p-invalid': editBlogErrors.date }"
            required
          />
          <small v-if="editBlogErrors.date" class="p-error">{{ editBlogErrors.date }}</small>
        </div>
        
        <div class="field">
          <label for="editBlogContent" class="block text-sm font-medium mb-2">Content *</label>
          <Textarea 
            id="editBlogContent"
            v-model="editingBlog.content"
            placeholder="Write your blog content here..."
            :class="{ 'p-invalid': editBlogErrors.content }"
            rows="12"
            class="w-full"
          />
          <small v-if="editBlogErrors.content" class="p-error">{{ editBlogErrors.content }}</small>
        </div>
      </form>
      
      <template #footer>
        <Button 
          label="Cancel" 
          severity="secondary"
          @click="showEditBlogDialog = false"
        />
        <Button 
          label="Update" 
          icon="pi pi-check" 
          @click="updateBlog"
          :loading="uploadingBlog"
        />
      </template>
    </Dialog>
    
    <!-- Edit Music Dialog -->
    <Dialog 
      v-model:visible="showEditMusicDialog" 
      modal 
      header="Edit Music" 
      :style="{ width: '40rem' }" 
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
    >
      <form @submit.prevent="updateMusic" class="grid grid-cols-1 gap-4">
        <div class="field">
          <label for="editMusicTitle" class="block text-sm font-medium mb-2">Title *</label>
          <InputText 
            id="editMusicTitle"
            v-model="editingMusic.title" 
            placeholder="Enter music title"
            class="w-full"
            :class="{ 'p-invalid': editMusicErrors.title }"
            required 
          />
          <small v-if="editMusicErrors.title" class="p-error">{{ editMusicErrors.title }}</small>
        </div>
        
        <div class="field">
          <label for="editMusicFile" class="block text-sm font-medium mb-2">Music File (Optional - leave empty to keep current)</label>
          <FileUpload 
            id="editMusicFile"
            mode="basic" 
            accept="audio/*"
            :maxFileSize="100000000"
            customUpload
            @select="onEditMusicSelect"
            chooseLabel="Choose New Music File"
          />
        </div>
      </form>
      
      <template #footer>
        <Button 
          label="Cancel" 
          icon="pi pi-times" 
          @click="showEditMusicDialog = false"
        />
        <Button 
          label="Update" 
          icon="pi pi-check" 
          @click="updateMusic"
          :loading="uploadingMusic"
        />
      </template>
    </Dialog>
    </div> <!-- End of authenticated content -->
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
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel'
import Password from 'primevue/password'

// Authentication state
const isAuthenticated = ref(false)
const loginPassword = ref('')
const loginError = ref('')
const authenticating = ref(false)

interface Sermon {
  id: string
  title: string
  date: string
  description?: string
  audioFile: string
  imageFile?: string
  notesFile?: string
  youtubeId?: string
  order: number
  createdAt: string
  images?: SermonImage[]
}

interface SermonImage {
  id: string
  sermonId: string
  imageFile: string
  createdAt: string
}

interface Blog {
  id: string
  title: string
  date: string
  content: string
  order: number
  createdAt: string
}

interface Music {
  id: string
  title: string
  musicFile: string
  order: number
  createdAt: string
}

// Reactive data
const sermons = ref<Sermon[]>([])
const blogs = ref<Blog[]>([])
const music = ref<Music[]>([])
const loading = ref(false)
const loadingBlogs = ref(false)
const loadingMusic = ref(false)
const uploading = ref(false)
const uploadingBlog = ref(false)
const uploadingMusic = ref(false)
const deleting = ref<string | null>(null)
const deletingBlog = ref<string | null>(null)
const deletingMusic = ref<string | null>(null)
const editing = ref<string | null>(null)
const showUploadForm = ref(false)
const showBlogForm = ref(false)
const showMusicForm = ref(false)
const showEditDialog = ref(false)
const showEditBlogDialog = ref(false)
const showEditMusicDialog = ref(false)

const newSermon = ref({
  title: '',
  date: null as Date | null,
  description: '',
  youtubeId: ''
})

const editingSermon = ref({
  id: '',
  title: '',
  date: null as Date | null,
  description: '',
  youtubeId: '',
  images: [] as SermonImage[]
})

const newBlog = ref({
  title: '',
  date: null as Date | null,
  content: ''
})

const editingBlog = ref({
  id: '',
  title: '',
  date: null as Date | null,
  content: ''
})

const newMusic = ref({
  title: ''
})

const editingMusic = ref({
  id: '',
  title: ''
})

const selectedAudioFile = ref<File | null>(null)
const selectedImageFile = ref<File | null>(null)
const selectedNotesFile = ref<File | null>(null)
const selectedImageFiles = ref<File[]>([])
const selectedEditAudioFile = ref<File | null>(null)
const selectedEditImageFile = ref<File | null>(null)
const selectedEditNotesFile = ref<File | null>(null)
const selectedEditImageFiles = ref<File[]>([])
const currentSermonImage = ref<string | null>(null)
const imageDeleted = ref(false)
const selectedMusicFile = ref<File | null>(null)
const selectedEditMusicFile = ref<File | null>(null)

const errors = ref({
  title: '',
  date: '',
  audioFile: '',
  youtubeId: ''
})

const blogErrors = ref({
  title: '',
  date: '',
  content: ''
})

const editBlogErrors = ref({
  title: '',
  date: '',
  content: ''
})

const musicErrors = ref({
  title: '',
  musicFile: ''
})

const editMusicErrors = ref({
  title: ''
})

const editErrors = ref({
  title: '',
  date: '',
  youtubeId: ''
})

// Computed properties
const isFormValid = computed(() => {
  return newSermon.value.title.trim() !== '' && 
         newSermon.value.date !== null && 
         selectedAudioFile.value !== null
})

// Methods
// Validate YouTube ID format
const validateYoutubeId = (youtubeId: string) => {
  if (!youtubeId || youtubeId === '') {
    return true // Empty is valid (optional field)
  }
  const youtubeIdPattern = /^[a-zA-Z0-9_-]{11}$/
  return youtubeIdPattern.test(youtubeId)
}

const validateForm = () => {
  errors.value = { title: '', date: '', audioFile: '', youtubeId: '' }
  
  if (!newSermon.value.title.trim()) {
    errors.value.title = 'Title is required'
  }
  
  if (!newSermon.value.date) {
    errors.value.date = 'Date is required'
  }
  
  if (!selectedAudioFile.value) {
    errors.value.audioFile = 'Audio file is required'
  }
  
  if (newSermon.value.youtubeId && !validateYoutubeId(newSermon.value.youtubeId)) {
    errors.value.youtubeId = 'Invalid YouTube ID. Must be 11 characters (letters, numbers, hyphens, underscores)'
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

const onImageFilesSelect = (event: any) => {
  selectedImageFiles.value = Array.from(event.files)
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
    formData.append('youtubeId', newSermon.value.youtubeId)
    formData.append('audioFile', selectedAudioFile.value!)
    
    if (selectedImageFile.value) {
      formData.append('imageFile', selectedImageFile.value)
    }
    
    if (selectedNotesFile.value) {
      formData.append('notesFile', selectedNotesFile.value)
    }
    
    // Append multiple images
    if (selectedImageFiles.value.length > 0) {
      selectedImageFiles.value.forEach((file) => {
        formData.append('imageFiles', file)
      })
    }
    
    await axios.post('/api/sermons', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Reset form
    newSermon.value = { title: '', date: null, description: '', youtubeId: '' }
    selectedAudioFile.value = null
    selectedImageFile.value = null
    selectedNotesFile.value = null
    selectedImageFiles.value = []
    
    // Clear file uploads
    const audioUpload = document.querySelector('#audioFile input') as HTMLInputElement
    const imageUpload = document.querySelector('#imageFile input') as HTMLInputElement
    const imageFilesUpload = document.querySelector('#imageFiles input') as HTMLInputElement
    const notesUpload = document.querySelector('#notesFile input') as HTMLInputElement
    if (audioUpload) audioUpload.value = ''
    if (imageUpload) imageUpload.value = ''
    if (imageFilesUpload) imageFilesUpload.value = ''
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

const onEditImageFilesSelect = (event: any) => {
  selectedEditImageFiles.value = Array.from(event.files)
}

const onEditNotesSelect = (event: any) => {
  selectedEditNotesFile.value = event.files[0]
}

// Function to delete a specific sermon image
const deleteSermonImage = async (imageId: string) => {
  if (!confirm('Are you sure you want to delete this image?')) return
  
  try {
    uploading.value = true
    await axios.delete(`/api/sermons/images/${imageId}`)
    
    // Refresh the sermon data to update the images list
    const response = await axios.get(`/api/sermons/${editingSermon.value.id}`)
    editingSermon.value.images = response.data.images || []
    
    // Also update the sermon in the main list
    await loadSermons()
  } catch (error) {
    console.error('Error deleting image:', error)
    alert('Failed to delete image. Please try again.')
  } finally {
    uploading.value = false
  }
}

const startEdit = (sermon: Sermon) => {
  editing.value = sermon.id
  showEditDialog.value = true
  editingSermon.value = {
    id: sermon.id,
    title: sermon.title,
    date: new Date(sermon.date),
    description: sermon.description || '',
    youtubeId: sermon.youtubeId || '',
    images: sermon.images || []
  }
  selectedEditAudioFile.value = null
  selectedEditImageFile.value = null
  selectedEditNotesFile.value = null
  selectedEditImageFiles.value = []
  currentSermonImage.value = sermon.imageFile || null
  imageDeleted.value = false
  editErrors.value = { title: '', date: '', youtubeId: '' }
}

const cancelEdit = () => {
  editing.value = null
  showEditDialog.value = false
  editingSermon.value = { id: '', title: '', date: null, description: '', youtubeId: '', images: [] }
  selectedEditAudioFile.value = null
  selectedEditImageFile.value = null
  selectedEditNotesFile.value = null
  selectedEditImageFiles.value = []
  currentSermonImage.value = null
  imageDeleted.value = false
  editErrors.value = { title: '', date: '', youtubeId: '' }
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
  editErrors.value = { title: '', date: '', youtubeId: '' }
  
  if (!editingSermon.value.title.trim()) {
    editErrors.value.title = 'Title is required'
  }
  
  if (!editingSermon.value.date) {
    editErrors.value.date = 'Date is required'
  }
  
  if (editingSermon.value.youtubeId && !validateYoutubeId(editingSermon.value.youtubeId)) {
    editErrors.value.youtubeId = 'Invalid YouTube ID. Must be 11 characters (letters, numbers, hyphens, underscores)'
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
    formData.append('youtubeId', editingSermon.value.youtubeId)
    
    if (selectedEditAudioFile.value) {
      formData.append('audioFile', selectedEditAudioFile.value)
    }
    
    if (selectedEditImageFile.value) {
      formData.append('imageFile', selectedEditImageFile.value)
    }
    
    if (selectedEditNotesFile.value) {
      formData.append('notesFile', selectedEditNotesFile.value)
    }
    
    // Append multiple images
    if (selectedEditImageFiles.value.length > 0) {
      selectedEditImageFiles.value.forEach((file) => {
        formData.append('imageFiles', file)
      })
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

// Blog Methods
const loadBlogs = async () => {
  try {
    loadingBlogs.value = true
    const response = await axios.get('/api/blogs')
    blogs.value = response.data
  } catch (error) {
    console.error('Error loading blogs:', error)
  } finally {
    loadingBlogs.value = false
  }
}

const createBlog = async () => {
  try {
    // Clear previous errors
    blogErrors.value = { title: '', date: '', content: '' }
    
    // Validate form
    let hasErrors = false
    
    if (!newBlog.value.title.trim()) {
      blogErrors.value.title = 'Title is required'
      hasErrors = true
    }
    
    if (!newBlog.value.date) {
      blogErrors.value.date = 'Date is required'
      hasErrors = true
    }
    
    if (!newBlog.value.content.trim() || newBlog.value.content === '<p><br></p>') {
      blogErrors.value.content = 'Content is required'
      hasErrors = true
    }
    
    if (hasErrors) return
    
    uploadingBlog.value = true
    
    const blogData = {
      title: newBlog.value.title.trim(),
      date: newBlog.value.date.toISOString().split('T')[0],
      content: newBlog.value.content
    }
    
    await axios.post('/api/blogs', blogData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    // Clear form and reload blogs
    clearBlogForm()
    await loadBlogs()
    
  } catch (error) {
    console.error('Error creating blog:', error)
    alert('Failed to create blog. Please try again.')
  } finally {
    uploadingBlog.value = false
  }
}

const clearBlogForm = () => {
  newBlog.value = {
    title: '',
    date: null,
    content: ''
  }
  blogErrors.value = { title: '', date: '', content: '' }
}

const editBlog = async (blog: Blog) => {
  editingBlog.value = {
    id: blog.id,
    title: blog.title,
    date: new Date(blog.date),
    content: blog.content
  }
  
  showEditBlogDialog.value = true
}

const updateBlog = async () => {
  try {
    // Clear previous errors
    editBlogErrors.value = { title: '', date: '', content: '' }
    
    // Validate form
    let hasErrors = false
    
    if (!editingBlog.value.title.trim()) {
      editBlogErrors.value.title = 'Title is required'
      hasErrors = true
    }
    
    if (!editingBlog.value.date) {
      editBlogErrors.value.date = 'Date is required'
      hasErrors = true
    }
    
    if (!editingBlog.value.content.trim() || editingBlog.value.content === '<p><br></p>') {
      editBlogErrors.value.content = 'Content is required'
      hasErrors = true
    }
    
    if (hasErrors) return
    
    uploadingBlog.value = true
    
    const blogData = {
      title: editingBlog.value.title.trim(),
      date: editingBlog.value.date.toISOString().split('T')[0],
      content: editingBlog.value.content
    }
    
    await axios.put(`/api/blogs/${editingBlog.value.id}`, blogData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    showEditBlogDialog.value = false
    await loadBlogs()
    
  } catch (error) {
    console.error('Error updating blog:', error)
    alert('Failed to update blog. Please try again.')
  } finally {
    uploadingBlog.value = false
  }
}

const deleteBlog = async (id: string) => {
  if (!confirm('Are you sure you want to delete this blog? This action cannot be undone.')) {
    return
  }
  
  try {
    deletingBlog.value = id
    await axios.delete(`/api/blogs/${id}`)
    await loadBlogs()
  } catch (error) {
    console.error('Error deleting blog:', error)
    alert('Failed to delete blog. Please try again.')
  } finally {
    deletingBlog.value = null
  }
}

// Music Methods
const loadMusic = async () => {
  try {
    loadingMusic.value = true
    const response = await axios.get('/api/music')
    music.value = response.data
  } catch (error) {
    console.error('Error loading music:', error)
  } finally {
    loadingMusic.value = false
  }
}

const createMusic = async () => {
  try {
    // Clear previous errors
    musicErrors.value = { title: '', musicFile: '' }
    
    // Validate form
    let hasErrors = false
    
    if (!newMusic.value.title.trim()) {
      musicErrors.value.title = 'Title is required'
      hasErrors = true
    }
    
    if (!selectedMusicFile.value) {
      musicErrors.value.musicFile = 'Music file is required'
      hasErrors = true
    }
    
    if (hasErrors) return
    
    uploadingMusic.value = true
    
    const formData = new FormData()
    formData.append('title', newMusic.value.title.trim())
    formData.append('musicFile', selectedMusicFile.value!)
    
    await axios.post('/api/music', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    // Reset form
    newMusic.value = { title: '' }
    selectedMusicFile.value = null
    showMusicForm.value = false
    
    await loadMusic()
  } catch (error) {
    console.error('Error creating music:', error)
    alert('Failed to create music. Please try again.')
  } finally {
    uploadingMusic.value = false
  }
}

const editMusic = (music: Music) => {
  editingMusic.value = {
    id: music.id,
    title: music.title
  }
  selectedEditMusicFile.value = null
  editMusicErrors.value = { title: '' }
  showEditMusicDialog.value = true
}

const updateMusic = async () => {
  try {
    // Clear previous errors
    editMusicErrors.value = { title: '' }
    
    // Validate form
    let hasErrors = false
    
    if (!editingMusic.value.title.trim()) {
      editMusicErrors.value.title = 'Title is required'
      hasErrors = true
    }
    
    if (hasErrors) return
    
    uploadingMusic.value = true
    
    const formData = new FormData()
    formData.append('title', editingMusic.value.title.trim())
    
    if (selectedEditMusicFile.value) {
      formData.append('musicFile', selectedEditMusicFile.value)
    }
    
    await axios.put(`/api/music/${editingMusic.value.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    
    showEditMusicDialog.value = false
    await loadMusic()
  } catch (error) {
    console.error('Error updating music:', error)
    alert('Failed to update music. Please try again.')
  } finally {
    uploadingMusic.value = false
  }
}

const deleteMusic = async (id: string) => {
  if (!confirm('Are you sure you want to delete this music? This action cannot be undone.')) {
    return
  }
  
  try {
    deletingMusic.value = id
    await axios.delete(`/api/music/${id}`)
    await loadMusic()
  } catch (error) {
    console.error('Error deleting music:', error)
    alert('Failed to delete music. Please try again.')
  } finally {
    deletingMusic.value = null
  }
}

const onMusicSelect = (event: any) => {
  selectedMusicFile.value = event.files[0]
  musicErrors.value.musicFile = ''
}

const onEditMusicSelect = (event: any) => {
  selectedEditMusicFile.value = event.files[0]
}

// Authentication functions
const authenticateAdmin = async () => {
  if (!loginPassword.value.trim()) {
    loginError.value = 'Password is required'
    return
  }
  
  authenticating.value = true
  loginError.value = ''
  
  try {
    const response = await axios.post('/api/auth/admin', {
      password: loginPassword.value
    })
    
    if (response.data.success) {
      isAuthenticated.value = true
      loginPassword.value = ''
      // Store authentication state in session storage
      sessionStorage.setItem('adminAuthenticated', 'true')
    }
  } catch (error) {
    if (error.response?.status === 401) {
      loginError.value = 'Invalid password'
    } else {
      loginError.value = 'Authentication failed. Please try again.'
    }
  } finally {
    authenticating.value = false
  }
}

const logout = () => {
  isAuthenticated.value = false
  sessionStorage.removeItem('adminAuthenticated')
}

// Check authentication state on component load
const checkAuthState = () => {
  const authenticated = sessionStorage.getItem('adminAuthenticated')
  if (authenticated === 'true') {
    isAuthenticated.value = true
  }
}

// Lifecycle
onMounted(async () => {
  checkAuthState()
  if (isAuthenticated.value) {
    loadSermons()
    await loadBlogs()
    await loadMusic()
  }
})
</script>

<style>
.editor-container :deep(.ql-editor) {
  /* This ensures the content can wrap */
  word-break: break-word;
  white-space: normal;
  overflow-wrap: break-word;
}
.admin-container {
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
  background: linear-gradient(to bottom, #000, #1a1a1a);
}
.p-listbox-option-selected {
  background: forestgreen !important;
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