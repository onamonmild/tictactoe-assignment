<template>
  <v-container style="padding-top: 3%">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8">
        <v-toolbar class="main-card" color="primary" elevation="5">
          <v-toolbar-title>Welcome, {{ displayName }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="logout" right><v-icon>mdi-logout</v-icon>Logout</v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="sub-main-card" elevation="5">
          <v-row>
            <v-col cols="12" md="6">
              <v-divider class="mt-8"></v-divider>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <v-row align="center" justify="center" style="padding-top: 3%; padding-bottom: 3%">
            <v-col cols="12" md="3">
              <v-icon icon="mdi-account-heart" size="120" :color="currentPlayer === human ? 'black' : 'grey'"></v-icon>
              <h3 :style="currentPlayer === human ? 'color: black;' : 'color: gray;'">YOU</h3>
            </v-col>

            <v-col cols="12" md="6">
              <div class="game-board">
                <div class="board">
                  <v-btn class="cell" v-for="(cell, index) in board" :key="index" @click="selectMoveIndex(index)"
                    :class="[(isGameEnd || cell !== null) ? 'cell-disable' : 'cell',
                    currentPlayer === bot ? 'cell-disable' : '']"
                    :color="cell === bot ? 'error' : cell === human ? 'success' : 'info'">
                    {{
                      cell }}
                  </v-btn>
                </div>
              </div>
            </v-col>

            <v-col cols="12" md="3">
              <v-icon icon="mdi-robot-love" size="120" :color="currentPlayer === bot ? 'black' : 'grey'"></v-icon>
              <h3 :style="currentPlayer === bot ? 'color: black;' : 'color: gray;'">BOT</h3>
            </v-col>
          </v-row>

          <v-divider class="mt-4"></v-divider>

          <v-row class="mt-4" v-if="isGameEnd">
            <v-col class="text-center">
              <v-btn @click="startGame()" color="secondary">Next Game</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
      <v-col cols="12" md="2">
        <v-card title="Score" class="sub-main-card" elevation="5">
          <div>
            <p>Score: {{ score }}</p>
            <p>Win Streak: {{ winStreak }}</p>
            <p>gameEndMessage: {{ gameEndMessage }}</p>
            <p>currentPlayer: {{ currentPlayer }}</p>
            <p>isGameEnd : {{ isGameEnd }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <div v-if="isGameEnd" class="gif-container">
      <img src="/Wingame.gif" alt="Game end" />
    </div>
  </v-container>
</template>

<script>
import { auth } from "../firebase";

export default {
  name: "TictactoeView",
  data() {
    return {
      // User
      user: null,
      displayName: "",

      // Board game
      bot: "O",
      human: "X",
      currentPlayer: "X",
      winPlayer: null,
      isGameEnd: false,

      board: Array(9).fill(null),
      winBoard: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ],

      // Score board
      score: 0,
      winStreak: 0,
      gameEndMessage: "",
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
    // User
    logout() {
      auth.signOut().then(() => {
        this.user = null;
        this.score = 0;
        this.$router.push("/");
      });
    },

    // Board game
    startGame() {
      this.isGameEnd = false;
      this.board = Array(9).fill(null);
      this.currentPlayer = this.human;
      this.winPlayer = null;
      this.gameEndMessage = "";
    },

    async selectMoveIndex(index) {
      this.board[index] = this.currentPlayer;

      let winPlayer = await this.calculateWinner(this.board, this.currentPlayer);
      if (winPlayer == this.human) {
        this.isGameEnd = true;
        this.gameEndMessage = "You is winner!";
        this.winPlayer = this.currentPlayer;
        this.score = this.score + 1;
      } else if (winPlayer == this.bot) {
        this.isGameEnd = true;
        this.gameEndMessage = "Bot is winner!";
        this.winPlayer = this.currentPlayer;
        this.score = this.score - 1;
      } else if (await this.calculateDrawGame(this.board) !== null) {
        this.isGameEnd = true;
        this.gameEndMessage = "Draw!";
      } else {
        await this.switchTurn();
      }
    },

    botMove(board) {
      const emptyIndex = [];
      for (let i = 0; i < board.length; i++) {
        if (board[i] === null || board[i] === "") {
          emptyIndex.push(i);
        }
      }
      let index = emptyIndex[Math.floor(Math.random() * emptyIndex.length)];
      setTimeout(() => this.selectMoveIndex(index), 500);
    },

    switchTurn() {
      this.currentPlayer = this.currentPlayer === this.human ? this.bot : this.human;
      if (this.currentPlayer == this.bot) {
        this.botMove(this.board);
      }
    },

    calculateWinner(board, currentPlayer) {
      for (let item of this.winBoard) {
        const [x, y, z] = item;
        console.log("X Y Z = " + x + y + z);
        if (
          board[x] !== "" &&
          board[x] !== null &&
          board[x] == board[y] &&
          board[y] == board[z]
        ) {
          console.log("calculateWinner");
          console.log(currentPlayer);
          return currentPlayer;
        }
      }
      return null;
    },

    calculateDrawGame(board) {
      if (board.every((x) => x !== "" && x !== null)) {
        return "Draw";
      }
      return null;
    },

    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
};
</script>

<style scoped>
.main-card {
  margin-left: auto;
  margin-right: auto;
  border-radius: 15px;
}

.sub-main-card {
  padding: 3%;
  text-align: center;
  height: 60vh;
  border-radius: 15px;
}

.game-board {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 120px);
  gap: 5px;
}

.cell {
  width: 120px;
  height: 120px;
  font-size: 4em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 1px solid gray;
}

.cell-disable {
  pointer-events: none;
}

.gif-container {
  position: fixed; 
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.gif-container img {
  max-width: 150%;
  max-height: 150%;
}
</style>
