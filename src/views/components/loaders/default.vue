<template>
  <div class="loading">
    <v-container fill-height>
      <v-row justify="center" align="center">
        <v-col class="text-center">
          <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <div>{{ $t("loadingPleaseWait") }}</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<style scoped>
.loading {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
