<template>
  <v-container style="padding-top: 3%;">
    <v-card class="main-card" max-width="400" style="padding: 3%; text-align: center;" elevation="15">
      <h1>Log in</h1>
      <v-img :src="require('../assets/logo.gif')" class="my-3" contain height="200" />
      <v-btn class="login-button" @click="signIn('Anonymous')" color="#85929e" prepend-icon="mdi-incognito">
        Anonymous
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="login-button" @click="signIn('Google')" color="#c71610" prepend-icon="mdi-gmail">
        Google
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="login-button" @click="signIn('Facebook')" color="blue" prepend-icon="mdi-facebook">
        Facebook
      </v-btn>
    </v-card>
  </v-container>

  <v-dialog width="400" v-model="dialogErrorSignIn">
    <v-card class="mx-auto" prepend-icon="mdi-alert-circle" width="400">
      <template v-slot:title>
        <span class="font-weight-black">Error</span>
      </template>

      <v-card-text>Failed to log in with {{ loginType }}. Please try again.</v-card-text>
      <v-card-actions class="justify-end">
        <v-btn text="Close" @click="dialogErrorSignIn = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { auth, googleProvider, facebookProvider } from '../firebase';
import { signInWithPopup, signInAnonymously } from 'firebase/auth';

export default {
  name: 'LoginPage',
  data: () => ({
    dialogErrorSignIn: false,
    loginType: "",
  }),
  methods: {
    async signIn(type) {
      this.loginType = type;
      try {
        if (type == "Anonymous") {
          await signInAnonymously(auth);
        }
        else if (type == "Facebook") {
          await signInWithPopup(auth, facebookProvider);
        }
        else if (type == "Google") {
          await signInWithPopup(auth, googleProvider);
        } else {
          // Not support type
        }
        this.$router.push('/Tictactoe');

      } catch (error) {
        this.dialogErrorSignIn = true;
        console.error('Error during Anonymous login:', error);
      }
    },
  }
};
</script>

<style scoped>
h2 {
  margin-bottom: 20px;
}

.main-card {
  margin-left: auto;
  margin-right: auto;
  border-radius: 50px;
}

.login-button {
  width: 200px;
  height: 40px;
  border-radius: 8px;
  margin-bottom: 10px;
}
</style>
