<template>
  <v-container class="d-flex flex-column align-center justify-center">
    <h2>Login to Play Tic Tac Toe</h2>
    <v-btn @click="signInWithEmail" color="success" class="mb-4">
      Login with Email
    </v-btn>
    <v-btn @click="signInWithGoogle" color="primary" class="mb-4">
      Login with Google
    </v-btn>
    <v-btn @click="signInWithFacebook" color="blue">
      Login with Facebook
    </v-btn>
  </v-container>
</template>

<script>
import { auth, googleProvider, facebookProvider, emailProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

export default {
  name: 'LoginPage', // เปลี่ยนชื่อให้เป็น multi-word
  methods: {
    async signInWithEmail() {
      try {
        await signInWithPopup(auth, emailProvider);
        this.$router.push('/Tictactoe'); // ไปที่หน้าเกมหลังจาก login สำเร็จ
      } catch (error) {
        console.error('Error during Email login:', error);
        alert('Failed to log in with Email');
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
</style>
