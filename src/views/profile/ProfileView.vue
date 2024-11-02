<template>
  <v-container>
    <v-row>
        <v-col sm="12" md="6">
           <profile-card />
        </v-col>
        <v-col sm="12" md="6">
           <reset-password-card />
        </v-col>
    </v-row>
    
  </v-container>
</template>

<script setup lang="ts">
import ProfileCard from "./components/ProfileCard.vue";
import ResetPasswordCard from "./components/ResetPasswordCard.vue";
</script>
<style scoped></style>
