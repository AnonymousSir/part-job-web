<template>
  <div class="bg-purple">
    <div class="stars">
        <div class="custom-navbar">
            <div class="brand-logo">
                <img src="../../../public/images/logo.svg" width="80px">
            </div>
            <div class="navbar-links">
                <ul>
                  <!-- <li><router-link to="/">Home</router-link></li> -->
                  <!-- <li><a href="http://localhost/404Page/404.html" target="_blank">About</a></li> -->
                  <!-- <li><a href="http://localhost/404Page/404.html" target="_blank">Features</a></li> -->
                  <li><router-link to="/" class="btn-request">Home</router-link></li>
                </ul>
            </div>
        </div>
        <div class="central-body">
            <img class="image-404" src="../../../public/images/404.svg" width="300px">
            <router-link to='/' class="btn-go-home">GO BACK HOME</router-link>
        </div>
        <div class="objects">
            <img class="object_rocket" src="../../../public/images/rocket.svg" width="40px">
            <div class="earth-moon">
                <img class="object_earth" src="../../../public/images/earth.svg" width="100px">
                <img class="object_moon" src="../../../public/images/moon.svg" width="80px">
            </div>
            <div class="box_astronaut">
                <img class="object_astronaut" src="../../../public/images/astronaut.svg" width="140px">
            </div>
        </div>
        <div class="glowing_stars">
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
            <div class="star"></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: '',
  data(){
    return{
      
    }
  },
  methods: {
    
  }
}
</script>

<style lang="less">
  @import './Page404.css';
</style>