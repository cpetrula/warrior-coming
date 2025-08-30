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

    <div v-else class="grid grid-cols-3 gap-4">
      <div 
        v-for="blog in blogs" 
        :key="blog.id"
        class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
     
        <h3>{{ blog.title }}</h3>
        
            <div class="editor-output" v-html="blog.content"></div>
        
        
      </div>
    </div>
      

    <!-- <DataView v-else :value="blogs" layout="grid" class="mt-6">
      <template #list="slotProps">
        <div class="flex flex-col">
        <Card v-for="(item, index) in slotProps.item" :key="index">
          <template #title>{{ item.title }}</template>
          <template #content>
            <div v-html="item.content"></div>
          </template>
        </Card>
        </div>
      </template>
    </DataView> -->
    
<<<<<<< HEAD
    <!-- Blog Grid View -->
    <div v-else-if="!selectedBlog" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
=======
    <!-- <div v-else class="space-y-6">
>>>>>>> c0152df (minor tweaks)
      <article 
        v-for="blog in blogs" 
        :key="blog.id"
        class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
        @click="selectBlog(blog)"
      >
        <header class="mb-4">
          <h2 class="text-xl font-bold text-white mb-2 line-clamp-2">{{ blog.title }}</h2>
          <time class="text-white/70 text-sm">{{ formatDate(blog.date) }}</time>
        </header>
        
        <div class="text-white/90 text-sm">
          {{ truncateContent(blog.content) }}
        </div>
        
        <div class="mt-4 text-blue-400 text-sm font-medium">
          Click to read more →
        </div>
      </article>
    </div>
    
    <!-- Full Blog View -->
    <div v-else class="space-y-6">
      <div class="flex items-center gap-4 mb-6">
        <Button 
          icon="pi pi-arrow-left" 
          label="Back to Blogs"
          @click="selectedBlog = null"
          outlined
          class="text-white border-white/50 hover:bg-white/10"
        />
      </div>
      
      <article class="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
        <header class="mb-4">
          <h2 class="text-2xl font-bold text-white mb-2">{{ selectedBlog.title }}</h2>
          <time class="text-white/70 text-sm">{{ formatDate(selectedBlog.date) }}</time>
        </header>
        
        <div 
<<<<<<< HEAD
          class="prose prose-invert prose-lg max-w-none text-white/90 whitespace-pre-wrap"
          v-text="selectedBlog.content"
=======
          class="prose prose-invert prose-lg text-white/90"
          v-html="blog.content"
>>>>>>> c0152df (minor tweaks)
        ></div>
      </article>
    </div> -->
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import ProgressSpinner from 'primevue/progressspinner'
<<<<<<< HEAD
import Button from 'primevue/button'
=======
import DataView from 'primevue/dataview'
import Card from 'primevue/card'
>>>>>>> c0152df (minor tweaks)

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
const selectedBlog = ref<Blog | null>(null)

// Methods
const loadBlogs = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/blogs')
    blogs.value = response.data
  } catch (error) {
    console.error('Error loading blogs:', error)
    // For demo purposes, add some mock data when API fails
    blogs.value = [
      {
        id: '1',
        title: 'Welcome to Our Blog',
        date: '2024-01-15',
        content: 'This is our first blog post. We are excited to share our thoughts and insights with you. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
        order: 1,
        createdAt: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        title: 'Understanding Modern Web Development',
        date: '2024-01-20',
        content: 'Modern web development has evolved significantly over the past few years. With new frameworks, tools, and best practices emerging constantly, developers need to stay updated. In this post, we explore the latest trends and technologies that are shaping the web development landscape.',
        order: 2,
        createdAt: '2024-01-20T14:30:00Z'
      },
      {
        id: '3',
        title: 'The Future of Technology',
        date: '2024-01-25',
        content: 'Technology continues to advance at an unprecedented pace. From artificial intelligence to quantum computing, the future holds exciting possibilities. This article discusses emerging technologies and their potential impact on society.',
        order: 3,
        createdAt: '2024-01-25T09:15:00Z'
      }
    ]
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

const truncateContent = (content: string) => {
  // Handle null/undefined content
  if (!content) {
    return ''
  }
  
  // Remove HTML tags and get plain text
  const plainText = content.replace(/<[^>]*>/g, '')
  if (plainText.length <= 100) {
    return plainText
  }
  return plainText.substring(0, 100) + '...'
}

const selectBlog = (blog: Blog) => {
  selectedBlog.value = blog
}

// Lifecycle
onMounted(() => {
  loadBlogs()
})
</script>

<style scoped>
.editor-output :deep(.ql-editor) {
  /* Apply the styles needed for proper rendering and wrapping */
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

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

/* Line clamp for title */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>