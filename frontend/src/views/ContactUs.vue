<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h1>Contact Us</h1>
      
      <section class="contact-section">
        <h2>Get In Touch</h2>
        <p>
          We'd love to hear from you! Whether you have questions, prayer requests, or just want 
          to connect, feel free to reach out to us.
        </p>
      </section>

      <!-- Contact Form -->
      <section class="contact-section contact-form-section">
        <h2>Send Us a Message</h2>
        
        <!-- Contact Form -->
        <form @submit.prevent="submitForm" class="contact-form">
          <!-- Honeypot field - hidden from users, visible to bots -->
          <div class="honeypot-field" aria-hidden="true">
            <label for="website">Website</label>
            <input 
              type="text" 
              id="website" 
              name="website"
              v-model="formData.website"
              tabindex="-1"
              autocomplete="off"
            />
          </div>

          <div class="field">
            <label for="name" class="block mb-2">Name *</label>
            <InputText 
              id="name"
              v-model="formData.name"
              placeholder="Your name"
              class="w-full"
              :class="{ 'p-invalid': errors.name }"
              maxlength="100"
              required
            />
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
          </div>

          <div class="field">
            <label for="email" class="block mb-2">Email *</label>
            <InputText 
              id="email"
              v-model="formData.email"
              type="email"
              placeholder="your.email@example.com"
              class="w-full"
              :class="{ 'p-invalid': errors.email }"
              maxlength="254"
              required
            />
            <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
          </div>

          <div class="field">
            <label for="message" class="block mb-2">Message *</label>
            <Textarea 
              id="message"
              v-model="formData.message"
              placeholder="How can we help you?"
              rows="6"
              class="w-full"
              :class="{ 'p-invalid': errors.message }"
              maxlength="5000"
              required
            />
            <small v-if="errors.message" class="p-error">{{ errors.message }}</small>
            <small class="char-count">{{ formData.message.length }} / 5000</small>
          </div>

          <div v-if="errors.submit" class="submit-error">
            <i class="pi pi-exclamation-triangle"></i>
            {{ errors.submit }}
          </div>

          <div class="form-actions">
            <Button 
              type="submit" 
              label="Send Message" 
              icon="pi pi-send"
              :loading="submitting"
              :disabled="submitting"
            />
          </div>
        </form>
      </section>

      <section class="contact-section">
        <h2>Email</h2>
        <p>
          For general inquiries: <a href="mailto:info@warriorcoming.com">info@warriorcoming.com</a>
        </p>
        <p>
          For prayer requests: <a href="mailto:prayer@warriorcoming.com">prayer@warriorcoming.com</a>
        </p>
      </section>

      <section class="contact-section">
        <h2>Connect With Us</h2>
        <p>
          Follow us on social media to stay updated with the latest sermons, music releases, 
          and community events.
        </p>
      </section>

      <section class="contact-section">
        <h2>Ministry Support</h2>
        <p>
          If you're interested in supporting our ministry or have questions about partnerships, 
          please reach out via email. We appreciate your prayers and support as we continue to 
          spread the message of faith.
        </p>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Button from 'primevue/button'

const router = useRouter()

// Form state
const formData = reactive({
  name: '',
  email: '',
  message: '',
  website: '' // Honeypot field
})

const errors = reactive({
  name: '',
  email: '',
  message: '',
  submit: ''
})

const submitting = ref(false)

// Validation
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.message = ''
  errors.submit = ''

  // Validate name
  if (!formData.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  } else if (formData.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(formData.email.trim())) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Validate message
  if (!formData.message.trim()) {
    errors.message = 'Message is required'
    isValid = false
  } else if (formData.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
    isValid = false
  }

  return isValid
}

// Submit form
const submitForm = async () => {
  if (!validateForm()) return

  submitting.value = true
  errors.submit = ''

  try {
    const response = await axios.post('/api/contact', {
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      website: formData.website // Honeypot field
    })

    if (response.data.success) {
      router.push('/thank-you')
    }
  } catch (error: any) {
    if (error.response?.status === 429) {
      const retryMinutes = error.response.data?.retryAfter || 15
      errors.submit = `Too many submissions. Please try again in ${retryMinutes} minute${retryMinutes !== 1 ? 's' : ''}.`
    } else if (error.response?.data?.error) {
      errors.submit = error.response.data.error
    } else {
      errors.submit = 'Failed to send message. Please try again later.'
    }
  } finally {
    submitting.value = false
  }
}
</script>



<style scoped>
.page-container {
  min-height: 100vh;
  padding: 100px 20px 50px;
  background-color: #000;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  color: white;
}

h1 {
  font-family: 'Cinzel Decorative', serif;
  font-size: 2.5em;
  margin-bottom: 40px;
  text-align: center;
}

h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
  color: #ddd;
}

.contact-section {
  margin-bottom: 40px;
}

.contact-section p {
  line-height: 1.8;
  color: #ccc;
}

.contact-section a {
  color: #6fa8dc;
  text-decoration: none;
}

.contact-section a:hover {
  text-decoration: underline;
}

/* Contact Form Styles */
.contact-form-section {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 30px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  color: #ddd;
  font-size: 0.95em;
  margin-bottom: 8px;
}

/* PrimeVue input overrides for dark theme */
:deep(.p-inputtext),
:deep(.p-textarea) {
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

:deep(.p-inputtext:focus),
:deep(.p-textarea:focus) {
  border-color: #6fa8dc;
  box-shadow: 0 0 0 2px rgba(111, 168, 220, 0.2);
}

:deep(.p-inputtext::placeholder),
:deep(.p-textarea::placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

:deep(.p-invalid) {
  border-color: #ef4444 !important;
}

.p-error {
  color: #ef4444;
  font-size: 0.85em;
  margin-top: 4px;
}

.char-count {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.8em;
  text-align: right;
  margin-top: 4px;
}

.form-actions {
  margin-top: 10px;
}

:deep(.p-button) {
  background-color: #6fa8dc;
  border-color: #6fa8dc;
}

:deep(.p-button:hover) {
  background-color: #5a93c7;
  border-color: #5a93c7;
}

:deep(.p-button:focus) {
  box-shadow: 0 0 0 2px rgba(111, 168, 220, 0.4);
}

/* Honeypot field - hidden from users */
.honeypot-field {
  position: absolute;
  left: -9999px;
  opacity: 0;
  height: 0;
  width: 0;
  overflow: hidden;
  pointer-events: none;
}

/* Error message */
.submit-error {
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.submit-error i {
  font-size: 1.2em;
}

@media (max-width: 480px) {
  h1 {
    font-size: 1.8em;
  }
  
  .page-container {
    padding: 80px 15px 40px;
  }

  .contact-form-section {
    padding: 20px 15px;
  }
}
</style>
