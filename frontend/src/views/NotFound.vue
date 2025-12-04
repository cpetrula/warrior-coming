<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      
      <p class="error-message">
        Sorry, the page you're looking for doesn't exist or has been moved.
      </p>

      <section class="help-section">
        <h3>Here are some helpful links:</h3>
        <div class="link-grid">
          <router-link to="/" class="help-link">
            <i class="pi pi-home"></i>
            <span>Home</span>
          </router-link>
          <router-link to="/sermons" class="help-link">
            <i class="pi pi-video"></i>
            <span>Sermons</span>
          </router-link>
          <router-link to="/music" class="help-link">
            <i class="pi pi-volume-up"></i>
            <span>Music</span>
          </router-link>
          <router-link to="/about" class="help-link">
            <i class="pi pi-info-circle"></i>
            <span>About Us</span>
          </router-link>
          <router-link to="/contact" class="help-link">
            <i class="pi pi-envelope"></i>
            <span>Contact Us</span>
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

h1 {
  font-family: 'Cinzel Decorative', serif;
  font-size: 6em;
  margin-bottom: 0;
  color: #fff;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

h2 {
  font-size: 2em;
  margin-top: 10px;
  margin-bottom: 30px;
  color: #ddd;
}

h3 {
  font-size: 1.2em;
  margin-bottom: 20px;
  color: #ccc;
}

.error-message {
  font-size: 1.1em;
  color: #999;
  margin-bottom: 40px;
  line-height: 1.6;
}

.help-section {
  margin-bottom: 40px;
}

.link-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-top: 20px;
}

.help-link {
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

.help-link:hover {
  background-color: #2a2a2a;
  transform: translateY(-3px);
  border-color: #555;
}

.help-link i {
  font-size: 1.5em;
  margin-bottom: 10px;
  color: #ccc;
}

.help-link span {
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
    font-size: 4em;
  }

  h2 {
    font-size: 1.5em;
  }

  .page-container {
    padding: 80px 15px 40px;
  }

  .link-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
