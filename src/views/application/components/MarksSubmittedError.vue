<script setup lang="ts">
import router from "@/router";
</script>

<template>
  <v-empty-state
    :headline="$t('applicationMarksSubmitted')"
    :title="$t('applicationMarksSubmittedMessage')"
    image="/imgs/logos/stepp.png"
    :action-text="$t('goBack')"
    @click:action="router.go(-1)"
  ></v-empty-state>
</template>
