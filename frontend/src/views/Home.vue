<template>
  <div class="home">
    <img src="/images/thewarrior.png" alt="Background" class="background-image" />
    
   
  </div>
  <div class="tagline">
    {{quote}}
    <div>{{quoteReference}}</div>
   </div>

   <!-- <div class="grid grid-cols-3 gap-5 justify-items-center" style="padding:50px;">
      <div style="width:80%;height:200px;background-color:white;opacity:50%;color:black;">
        test
      </div>
      <div style="width:80%;height:200px;background-color:white;opacity:50%;color:black;">
        test 2
      </div>
      <div style="width:80%;height:200px;background-color:white;opacity:50%;color:black;">
        test 3
      </div>
   </div> -->
   
   <!-- <audio autoplay loop>
      <source src="/audio/thewarrior.wav" type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio> -->
    <vue-sound
  title="The Warrior"
  title-link=""
  details=""
  details-link=""
  show-download
  file="/audio/thewarrior.wav"
/>

</template>
<script lang="ts" setup>

import { ref, useTemplateRef,onMounted } from 'vue'
import { VueSound } from 'vue-sound'

//const quote = ref("The LORD is a warrior; the LORD is his name!");
//const quoteReference = ref("Exodus 15:3");

const quote = ref("And I saw heaven opened, and behold a white horse; and he that sat upon him was called Faithful and True, His eyes were as a flame of fire, and on his head were many crowns; and he had a name written, that no man knew, but he himself. And he was clothed with a vesture dipped in blood: and his name is called The Word of God. And out of his mouth goeth a sharp sword, that with it he should smite the nations: and he hath on his vesture and on his thigh a name written, KING OF KINGS, AND LORD OF LORDS.");

const quoteReference = ref("~ Revelation 19:11-16");


</script>
<style>
.home {
  position: relative;
  /* height: 100vh;
  width: 100vw;
  overflow: hidden; */
}
.background-image {
     /* filter: contrast(150%) grayscale(100%); */
  /* position: absolute;
  top: 0px;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; */
  width:100%;
}
.vue-sound {
  position: fixed;
  bottom: 0px;
  right: 0px;
  z-index: 1000;
  width: 100%;
}
.tagline {
  position: absolute;
  /* top: 50%;
  left: 50%; */
  top:150px;
  right:20px;
  width:320px;
  /* transform: translate(-50%, -50%); */
  color: white;
  font-size: 1.2em;
  text-align: center;
   /* left:25%;width:50%; */
   border-radius:10px;
   /* background-color:black; */
   opacity:50%;
   padding:0px;
}

.player {
  background-color: black !important;
}

</style>