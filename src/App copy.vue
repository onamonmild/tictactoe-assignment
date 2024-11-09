<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  components: {

  },

  data: () => ({
    //
  }),
}
</script>

<style>
@import '~vuetify/styles';
.v-application {
  font-family: "Itim", cursive !important;
  font-weight: 400;
  font-style: normal;
}
</style>