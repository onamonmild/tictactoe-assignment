import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCWrWMtP8Uygp1C-F98MpqCHacDNhsYEBg",
  authDomain: "tictactoe-assignment.firebaseapp.com",
  projectId: "tictactoe-assignment",
  storageBucket: "tictactoe-assignment.firebasestorage.app",
  messagingSenderId: "484911321028",
  appId: "1:484911321028:web:8683948a71837f44785e91"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const githubProvider = new GithubAuthProvider();
