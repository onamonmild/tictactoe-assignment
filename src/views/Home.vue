<template>
  <v-container style="padding-top: 3%;">
    <v-card class="main-card" max-width="400" style="padding: 3%; text-align: center;" elevation="15">
      <h1 class="header-text">
        <span class="rotate-text-1">Tic</span>
        <span class="rotate-text-2">Tac</span>
        <span class="rotate-text-3">Toe!</span>
      </h1>
      <v-img :src="require('../assets/logo.gif')" class="my-3" contain height="200" />
      <v-btn color="error" size="x-large" to="/login">Enter</v-btn>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'HomeView',
};
</script>

<style>
.header-text {
  font-family: 'Itim', sans-serif;
  font-size: 40px;
}

.main-card {
  margin-left: auto;
  margin-right: auto;
  border-radius: 50px;
}

.rotate-text-1 {
  display: inline-block;
  transform: rotate(-2deg);
  margin-right: 10px;
}

.rotate-text-2 {
  display: inline-block;
  transform: rotate(2deg);
  margin-right: 10px;
}

.rotate-text-3 {
  display: inline-block;
  transform: rotate(-5deg);
  margin-right: 10px;
}
</style>