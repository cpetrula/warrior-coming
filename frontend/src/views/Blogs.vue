<template>
  <div class="blogs-container p-6">
    <h1 class="text-3xl font-bold mb-6 text-white">Blogs</h1>
    
    <div v-if="loading" class="text-center py-8">
      <ProgressSpinner />
      <p class="mt-4 text-white">Loading blogs...</p>
    </div>
    
    <div v-else-if="blogs.length === 0" class="text-center py-8">
      <div class="bg-white/10 backdrop-blur-sm rounded-lg p-8">
        <p class="text-white text-lg">No blogs available at the moment.</p>
        <p class="text-white/70 mt-2">Check back soon for new content!</p>
      </div>
    </div>
    
    <div v-else class="space-y-6">
      <article 
        v-for="blog in blogs" 
        :key="blog.id"
        class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20"
      >
        <header class="mb-4">
          <h2 class="text-2xl font-bold text-white mb-2">{{ blog.title }}</h2>
          <time class="text-white/70 text-sm">{{ formatDate(blog.date) }}</time>
        </header>
        
        <div 
          class="prose prose-invert prose-lg max-w-none text-white/90"
          v-html="blog.content"
        ></div>
      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProgressSpinner from 'primevue/progressspinner'

interface Blog {
  id: string
  title: string
  date: string
  content: string
  order: number
  createdAt: string
}

// Reactive data
const blogs = ref<Blog[]>([])
const loading = ref(false)

// Methods
const loadBlogs = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/blogs')
    blogs.value = response.data
  } catch (error) {
    console.error('Error loading blogs:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  loadBlogs()
})
</script>

<style scoped>
/* Custom prose styles for dark theme */
.prose-invert h1,
.prose-invert h2,
.prose-invert h3,
.prose-invert h4,
.prose-invert h5,
.prose-invert h6 {
  color: white;
}

.prose-invert a {
  color: #60a5fa;
}

.prose-invert a:hover {
  color: #93c5fd;
}

.prose-invert strong {
  color: white;
}

.prose-invert code {
  color: #fbbf24;
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
}

.prose-invert blockquote {
  border-left: 4px solid #60a5fa;
  background-color: rgba(96, 165, 250, 0.1);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
}

.prose-invert ul,
.prose-invert ol {
  color: rgba(255, 255, 255, 0.9);
}

.prose-invert li {
  margin: 0.5rem 0;
}
</style>