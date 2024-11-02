<template>
  <v-footer app height="30" class="d-flex bg-grey-lighten-3" bg-color="primary">
    <v-container>
      <v-row no-gutters class="d-flex justify-center align-center">
        <v-col sm="12" md="4">
          <p class="text-primary text-caption">
            {{ $t("copyright") }} {{ new Date().getFullYear() }} {{  $t('elevaInt') }}
          </p>
        </v-col>
        <v-col sm="12" md="4" class="d-flex justify-center align-center">
          <v-img :width="150" :height="35" src="/imgs/logos/eleva.png"></v-img>
        </v-col>
        <v-col sm="12" md="4">
          <p class="float-right">
            <v-btn
              class="text-none text-primary"
              variant="plain"
              :href="mailtoLink"
            >
              <v-icon class="pr-3">mdi-email</v-icon>
              <p class="text-caption">info@elevainternational.com</p>
            </v-btn>
        </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>
<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n();
// Define the email, subject, and body
const email = ref("info@elevainternational.com");
const subject = ref(t("hello"));
const body = ref(t("defaultEmailBody"));
// Compute the mailto link
const mailtoLink = computed(() => {
  return `mailto:${email.value}?subject=${encodeURIComponent(
    subject.value
  )}&body=${encodeURIComponent(body.value)}`;
});
</script>
