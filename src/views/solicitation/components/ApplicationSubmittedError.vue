<script setup lang="ts">
import router from "@/router";
</script>

<template>
  <v-empty-state
    :headline="$t('applicationSubmitted')"
    :title="$t('applicationSubmittedMessage')"
    image="/imgs/logos/stepp.png"
    :action-text="$t('goBack')"
    @click:action="router.go(-1)"
  ></v-empty-state>
</template>
