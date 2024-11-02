<template>
  <Navbar />

  <router-view :key="$route.fullPath" v-slot="{ Component }">
    <component :is="Component" />
  </router-view>

  <Footer></Footer>
</template>

<script setup lang="ts">
import Navbar from "@/views/workspace/components/Navbar.vue";
import Footer from "@/views/workspace/components/Footer.vue";
</script>
