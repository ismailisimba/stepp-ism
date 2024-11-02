<template>
  <nav>
    <v-toolbar flat app>
      <!-- Drawer toggle button -->
      <v-app-bar-nav-icon
        @click="showDrawer = !showDrawer"
      ></v-app-bar-nav-icon>

      <!-- Title -->
      <v-toolbar-title>
        <Search :show="showSearchModal" @close="showSearchModal = false" />
        <!-- <v-btn flat variant="text" prepend-icon="mdi-magnify" class="text-none">
          {{ $t("search") }}
        </v-btn> -->
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-avatar right size="36px">
              <v-img alt="Avatar" src="/imgs/profile.jpg"></v-img>
            </v-avatar>
          </v-btn>
        </template>

        <v-list>
          <v-list-item
            v-for="link in links"
            class="text-h6"
            @click="goToPage(link.routeName)"
            :key="link.title"
            :prepend-icon="link.icon"
            :title="$t(link.title)"
          >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <!-- Navigation Drawer -->
    <Drawer @support="support" :show="showDrawer" />
  </nav>

  <SupportFormModal
    :show="showSupportDialog"
    @success="showSupportDialog = false"
    @fail="showSupportDialog = false"
    @close="showSupportDialog = false"
  />
</template>

<script lang="ts" setup>
import { navLinks } from "@/helpers/links";
import { defineAsyncComponent, ref } from "vue";
import Drawer from "./Drawer.vue";
import router from "@/router";
import { Link } from "@/types/Link";
import { useAuthStore } from "@/store/authStore";
import Search from "./Search.vue";
const SupportFormModal = defineAsyncComponent(
  () => import("@/views/support/SupportModalForm.vue")
);

const links: Link[] = navLinks;
const showDrawer = ref(true);
const showSupportDialog = ref<boolean>(false);
const showSearchModal = ref<boolean>(false);

const support = () => {
  showSupportDialog.value = true;
};

const goToPage = async (routeName: string) => {
  switch (routeName) {
    case "signOut":
      const authStore = useAuthStore();
      await authStore.signOut();
      break;

    case "support":
      support();
      break;

    default:
      router.push({ name: routeName });
      break;
  }
};
</script>
