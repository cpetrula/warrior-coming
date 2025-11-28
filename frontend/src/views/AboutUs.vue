<template>
  <div class="page-container">
    <div class="content-wrapper">
      <h1>About Us</h1>
      
      <section class="about-section">
        <h2>Our Mission</h2>
        <p>
          Warrior Coming is dedicated to spreading the message of faith, hope, and spiritual strength 
          through sermons, music, and community. We believe in the transformative power of God's word 
          and seek to inspire believers to live boldly in their faith.
        </p>
      </section>

      <section class="about-section">
        <h2>Our Story</h2>
        <p>
          Founded with a passion for worship and teaching, Warrior Coming emerged from a desire to 
          reach people wherever they are. Our ministry combines powerful sermons with uplifting music 
          to create an experience that touches hearts and transforms lives.
        </p>
      </section>

      <section class="about-section">
        <h2>What We Believe</h2>
        <p>
          We believe in the authority of Scripture, the saving grace of Jesus Christ, and the 
          empowering presence of the Holy Spirit. Our foundation is built on love, truth, and the 
          unwavering promises of God.
        </p>
      </section>

      <section class="about-section">
        <h2>Join Us</h2>
        <p>
          Whether you're seeking spiritual guidance, looking for inspiring music, or wanting to 
          connect with a community of believers, we welcome you. Explore our sermons, listen to 
          our music, and become part of the Warrior Coming family.
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

.about-section {
  margin-bottom: 40px;
}

.about-section p {
  line-height: 1.8;
  color: #ccc;
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
