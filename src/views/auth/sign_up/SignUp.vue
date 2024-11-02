<template>
  <v-container class="fill-height" fluid>
    <v-row no-gutters>
      <v-col cols="12" class="d-flex justify-center align-center">
        <v-card variant="text" min-width="500" max-width="600">
          <v-card-title class="pb-8">
            <v-row>
              <v-spacer></v-spacer>
              <v-col>
                <v-img
                  class="text-right pa-0 ma-0"
                  aspect-ratio="1"
                  height="80"
                  src="/imgs/logos/stepp.png"
                ></v-img>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-subtitle class="pb-4">
            {{ $t("signUpTitle") }}
          </v-card-subtitle>
          <v-card-text>
            <v-tabs v-model="tab" fixed-tabs>
              <v-tab value="applicant" :text="$t('applicant')"></v-tab>
              <v-tab value="donor" :text="$t('donor')"></v-tab>
            </v-tabs>
            <v-tabs-window v-model="tab">
              <v-tabs-window-item value="applicant">
                <v-container class="pt-3">
                  <Applicant />
                </v-container>
              </v-tabs-window-item>
              <v-tabs-window-item value="donor">
                <v-container class="pt-3">
                  <Donor />
                </v-container>
              </v-tabs-window-item>
            </v-tabs-window>
          </v-card-text>
          <div class="mt-auto d-flex justify-center">
            <v-card-actions>
              {{ $t("alreadyHaveAnAccount") }}
              <router-link :to="{ name: 'sign_in' }">
                {{ $t("signIn") }}
              </router-link>
            </v-card-actions>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Applicant from "./Applicant.vue";
import Donor from "./Donor.vue";

export default defineComponent({
  name: "SignUpForm",

  data: () => ({
    tab: "applicant",
  }),

  components: {
    Applicant,
    Donor,
  },
});
</script>

<style scoped>
.fill-height {
  height: 100vh;
}

.photo-section .v-img {
  object-fit: cover;
  /* Ensure the image covers the container */
}
</style>
