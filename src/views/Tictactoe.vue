<template>
  <v-container style="padding-top: 3%;">
    <v-row no-gutters align="center" justify="center">
      <v-col cols="8" style="padding-bottom: 2%;">
        <v-toolbar color="primary" elevation="3">
          <v-toolbar-title>Welcome, {{ displayName }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="logout" right><v-icon>mdi-logout</v-icon>Logout</v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-row no-gutters align="center" justify="center">
      <v-col cols="6" style="padding-right: 2%;">
        <v-card title="Game" style="padding: 3%; text-align: center;" elevation="3">
          <div class="board">
            <div v-for="(cell, index) in board" :key="index" class="cell" @click="makeMove(index)">
              {{ cell }}
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card title="Score" style="padding: 3%; text-align: center;" elevation="3">
          <div>
            <p>Score: {{ score }}</p>
            <p>Win Streak: {{ winStreak }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { auth } from '../firebase';

export default {
  name: 'TictactoeView',
  data() {
    return {
      // User
      user: null,
      displayName: "",

      board: Array(9).fill(''),
      currentPlayer: 'X',
      score: 0,
      winStreak: 0,
    };
  },

  created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName) {
          this.displayName = user.displayName;
        } else if (user.isAnonymous) {
          this.displayName = "Anonymous";
        } else {
          this.displayName = "Unknown user";
        }
      } else {
        this.displayName = null;
      }
    });
  },

  methods: {
    logout() {
      auth.signOut().then(() => {
        this.user = null;
        this.score = 0;
        this.$router.push('/');
      });
    },
    makeMove(index) {
      if (this.board[index] === '') {
        this.board[index] = this.currentPlayer;
        if (this.checkWin(this.currentPlayer)) {
          alert(`${this.currentPlayer} wins!`);
          if (this.currentPlayer === 'X') {
            this.score += 1;
            this.winStreak += 1;
            if (this.winStreak === 3) {
              this.score += 1;
              this.winStreak = 0;
            }
          } else {
            this.score -= 1;
          }
          this.resetBoard();
        } else {
          this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        }
      }
    },
    checkWin(player) {
      const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
      ];
      return winningCombos.some(combo => combo.every(index => this.board[index] === player));
    },
    resetBoard() {
      this.board = Array(9).fill('');
      this.currentPlayer = 'X';
    }
  }
};
</script>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, 100px);
  grid-gap: 5px;
}

.cell {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #000;
  font-size: 24px;
  cursor: pointer;
}
</style>