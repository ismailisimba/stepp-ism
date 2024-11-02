<template>
  <DefaultLoader v-if="isLoading" />

  <v-row no-gutters class="fill-height d-flex align-center justify-center">
    <v-col cols="12">
      <v-sheet border class="pa-5 ma-5" color="error" rounded>
        {{ t("generalErrorMessage") }}
      </v-sheet>
      <div class="text-center">
        <v-btn
          class="text-none mt-10"
          color="primary"
          :to="{ name: 'sign_in' }"
        >
          {{ $t("goBack") }}
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import DefaultLoader from "../components/loaders/default.vue";
import { onMounted } from "vue";
import Cookies from "js-cookie";
import { getAuthUser } from "@/services/auth_service";
import { useAuthStore } from "@/store/authStore";
import { ref } from "vue";
import router from "@/router";
import { useI18n } from "vue-i18n";

const route = useRoute();
const cookie = route.query.cookie as string | undefined;
const authStore = useAuthStore();
const isLoading = ref<boolean>(true);
const { t } = useI18n();

const setCookie = () => {
  Cookies.set("cookie", cookie as string);
};

const getUser = async () => {
  try {
    const user = await getAuthUser();
    authStore.setUser(user);
    router.push({ name: "home" });
  } catch (error) {
    isLoading.value = false;
    throw error;
  }
};

onMounted(() => {
  setCookie();
  getUser();
});
</script>
