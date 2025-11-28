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

@media (max-width: 480px) {
  h1 {
    font-size: 1.8em;
  }
  
  .page-container {
    padding: 80px 15px 40px;
  }
}
</style>
