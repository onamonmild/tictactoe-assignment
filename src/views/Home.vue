<template>
  <v-container style="padding-top: 3%;">
    <v-card class="main-card" max-width="400" style="padding: 3%; text-align: center;" elevation="15">
      <div class="text-h3">Tic Tac Toe</div>
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
.main-card {
  margin-left: auto;
  margin-right: auto;
  border-radius: 50px;
}
</style>