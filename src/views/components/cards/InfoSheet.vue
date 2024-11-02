<template>
  <v-card
    min-width="270"
    max-width="380"
    class="mx-auto pa-3 custom-rounded-card"
    :color="bgColor"
  >
    <v-card-text>
      <v-row no-gutters>
        <v-col cols="3">
          <v-icon :size="iconSize">{{ topIcon }}</v-icon>
        </v-col>
        <v-spacer></v-spacer>
        <v-col
          cols="8"
          class="align-center d-flex justify-start text-uppercase text-caption"
          >{{ topTitle }}:</v-col
        >
        <v-col cols="12">
          <v-card flat height="60" color="transparent">
            <v-card-text class="text-uppercase">
              {{ topSubtitle }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-divider
        class="border-opacity-100"
        :thickness="2"
        color="white"
      ></v-divider>

      <v-row no-gutters>
        <v-col cols="3">
          <v-icon :size="iconSize">{{ bottomIcon }}</v-icon>
        </v-col>
        <v-spacer></v-spacer>
        <v-col
          cols="8"
          class="d-flex align-center justify-start text-uppercase text-caption"
        >
          {{ bottomTitle }}:
        </v-col>
        <v-col cols="12">
          <v-card flat height="60" color="transparent">
            <v-card-text class="text-uppercase">
              {{ bottomSubtitle }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{
  bgColor: string;
  topIcon: string;
  bottomIcon: string;
  topTitle: string | number;
  topSubtitle: string | number;
  bottomTitle: string | number;
  bottomSubtitle: string | number;
}>();
const iconSize = 70;
</script>

<style scoped></style>
