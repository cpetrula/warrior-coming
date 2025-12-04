<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="success-icon">
        <i class="pi pi-check-circle"></i>
      </div>
      
      <h1>Thank You!</h1>
      
      <p class="thank-you-message">
        Your message has been received. We appreciate you reaching out to us 
        and will get back to you as soon as possible.
      </p>

      <section class="next-steps">
        <h2>While You Wait</h2>
        <p>Feel free to explore more of what we have to offer:</p>
        <div class="link-grid">
          <router-link to="/sermons" class="action-link">
            <i class="pi pi-video"></i>
            <span>Watch Sermons</span>
          </router-link>
          <router-link to="/music" class="action-link">
            <i class="pi pi-volume-up"></i>
            <span>Listen to Music</span>
          </router-link>
          <router-link to="/about" class="action-link">
            <i class="pi pi-info-circle"></i>
            <span>About Us</span>
          </router-link>
        </div>
      </section>

      <router-link to="/" class="back-home-btn">
        Go Back Home
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 100px 20px 50px;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content-wrapper {
  max-width: 600px;
  margin: 0 auto;
  color: white;
  text-align: center;
}

.success-icon {
  margin-bottom: 20px;
}

.success-icon i {
  font-size: 5em;
  color: #4ade80;
}

h1 {
  font-family: 'Cinzel Decorative', serif;
  font-size: 3em;
  margin-bottom: 20px;
  color: #fff;
}

h2 {
  font-size: 1.3em;
  margin-bottom: 15px;
  color: #ddd;
}

.thank-you-message {
  font-size: 1.2em;
  color: #ccc;
  margin-bottom: 40px;
  line-height: 1.8;
}

.next-steps {
  margin-bottom: 40px;
}

.next-steps > p {
  color: #999;
  margin-bottom: 20px;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.action-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 15px;
  background-color: #1a1a1a;
  border-radius: 10px;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid #333;
}

.action-link:hover {
  background-color: #2a2a2a;
  transform: translateY(-3px);
  border-color: #555;
}

.action-link i {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #ccc;
}

.action-link span {
  font-size: 0.9em;
}

.back-home-btn {
  display: inline-block;
  padding: 15px 40px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.1em;
  transition: all 0.3s ease;
  border: 1px solid #555;
}

.back-home-btn:hover {
  background-color: #444;
  transform: translateY(-2px);
}

@media (max-width: 480px) {
  h1 {
    font-size: 2em;
  }

  .success-icon i {
    font-size: 3.5em;
  }

  .page-container {
    padding: 80px 15px 40px;
  }

  .link-grid {
    grid-template-columns: repeat(1, 1fr);
  }
}
</style>
