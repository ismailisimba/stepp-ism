<template>
  <v-container class="fill-height pa-0 ma-0" fluid>
    <v-row class="fill-height">
      <v-col cols="12" md="6" class="pa-0 ma-0 d-none d-md-flex">
        <v-img height="100vh" cover src="/imgs/auth-pic.jpg"></v-img>
      </v-col>
      <v-col cols="12" md="6">
        <router-view :key="$route.fullPath" v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scope></style>
