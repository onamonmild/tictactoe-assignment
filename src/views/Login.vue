<template>
  <v-container style="padding-top: 3%;">
    <v-card class="main-card" max-width="400" style="padding: 3%; text-align: center;" elevation="15">
      <h1>Log in</h1>
      <v-img :src="require('../assets/logo.gif')" class="my-3" contain height="200" />
      <v-btn class="login-button" @click="signInWithAnonymous" color="#85929e" prepend-icon="mdi-incognito">
        Anonymous
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn  class="login-button" @click="signInWithGoogle" color="#c71610" prepend-icon="mdi-gmail">
        Google
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn class="login-button" @click="signInWithFacebook" color="blue" prepend-icon="mdi-facebook">
        Facebook
      </v-btn>
    </v-card>
  </v-container>
</template>

<script>
import { auth, googleProvider, facebookProvider, signInAnonymouslyUser } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export default {
  name: 'LoginPage', // เปลี่ยนชื่อให้เป็น multi-word
  methods: {
    async signInWithAnonymous() {
      try {
        await signInWithPopup(auth, signInAnonymouslyUser);
        this.$router.push('/Tictactoe'); // ไปที่หน้าเกมหลังจาก login สำเร็จ
      } catch (error) {
        console.error('Error during Anonymous login:', error);
        alert('Failed to log in with Anonymous');
      }
    },
    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, googleProvider);
        this.$router.push('/Tictactoe'); // ไปที่หน้าเกมหลังจาก login สำเร็จ
      } catch (error) {
        console.error('Error during Google login:', error);
        alert('Failed to log in with Google');
      }
    },
    async signInWithFacebook() {
      try {
        await signInWithPopup(auth, facebookProvider);
        this.$router.push('/Tictactoe'); // ไปที่หน้าเกมหลังจาก login สำเร็จ
      } catch (error) {
        console.error('Error during Facebook login:', error);
        alert('Failed to log in with Facebook');
      }
    }
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
