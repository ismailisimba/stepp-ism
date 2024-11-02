<template>
  <v-empty-state
    :headline="$t('whoops404')"
    :title="$t('pageNotFound')"
    :text="$t('pageNotFoundText')"
    image="/imgs/logos/eleva.png"
    :action-text="$t('goToHomePage')"
     @click:action="router.push({path : '/'})"
  ></v-empty-state>
</template>

<script setup lang="ts">
import router from "@/router";
</script>
