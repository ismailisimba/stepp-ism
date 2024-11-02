<template>
  <v-empty-state
    :title="$t('error')"
    :text="$t('oopsError')"
    image="/imgs/logos/eleva.png"
    :action-text="$t('retry')"
    @click:action="router.go"
  ></v-empty-state>
</template>

<script setup lang="ts">
import router from "@/router";
</script>
