<template>
  <v-navigation-drawer
    class="bg-primary custom-font-size"
    app
    width="270"
    v-model="showDrawer"
  >
    <v-row>
      <v-col cols="12" class="d-flex justify-start">
        <v-img
          max-height="63"
          width="10"
          src="/imgs/logos/stepp-white.png"
        ></v-img>
      </v-col>
    </v-row>

    <v-divider></v-divider>

    <v-list density="comfortable" nav>
      <v-list-item
        v-for="link in mLinks"
        class="pa-4"
        @click="goToPage(link.routeName)"
        :key="link.title"
        :prepend-icon="link.icon"
      >
        <v-list-item-title class="text-subtitle-1">
          {{ $t(link.title) }}
        </v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>

      <v-list-item
        v-for="link in sLinks"
        class="pa-4"
        @click="goToPage(link.routeName)"
        :key="link.title"
        :prepend-icon="link.icon"
      >
        <v-list-item-title class="text-subtitle-1">
          {{ $t(link.title) }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { mDrawerLinks, sDrawerLinks } from "@/helpers/links";
import router from "@/router";
import { ref, watch } from "vue";

const props = defineProps<{
  show: boolean;
}>();

const mLinks = mDrawerLinks;
const sLinks = sDrawerLinks;
const showDrawer = ref(true);

const goToPage = (routeName: string) => {
  switch (routeName) {
    case "support":
      emit("support");
      break;

    default:
      router.push({ name: routeName });
      break;
  }
};

watch(
  () => props.show,
  (newValue) => {
    showDrawer.value = newValue;
  }
);

const emit = defineEmits<{
  (e: "support"): void;
}>();
</script>

<style scoped>
.custom-font-size .v-list-item-title {
  font-size: 120px; /* Customize the font size here */
}
</style>
