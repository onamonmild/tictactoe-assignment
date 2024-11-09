<template>
  <v-container style="padding-top: 3%">
    <v-row align="center" justify="center">
      <v-col cols="12" md="8">
        <v-toolbar class="main-card" color="primary" elevation="5">
          <v-toolbar-title>
            <h3>Welcome, {{ displayName }}</h3>
          </v-toolbar-title>
          <v-btn @click="logout" size="x-large" right><v-icon>mdi-logout</v-icon>
            <h4>Logout</h4>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>

    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="sub-main-card" elevation="5">
          <v-row>
            <v-col cols="12" md="12">
              <v-btn-toggle v-model="currentPlayer" color="primary" mandatory class="turn-toggle">
                <v-btn :value="human">
                  <v-icon icon="mdi-robot-happy" size="40" start></v-icon>
                  <h2>Easy</h2>
                </v-btn>
                <v-btn :value="bot">
                  <v-icon icon="mdi-robot-angry" size="40" start></v-icon>
                  <h2>Hard</h2>
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <v-row align="start" justify="center" style="padding-top: 3%; padding-bottom: 3%">
            <v-col cols="12" md="3" height="100%">
              <v-icon icon="mdi-account-tie" size="120" :color="currentPlayer === human ? '#3f3f3f' : 'grey'"
                :class="currentPlayer === human ? 'bounce' : ''"></v-icon><br>
              <h3 :style="currentPlayer === human ? 'color: #3f3f3f;' : 'color: grey;'">Player (X)</h3>
              <div>
                <p :style="{ fontSize: '110px', color: '#3f3f3f' }">1</p>
                <p :style="{ fontSize: '20px' }" color="primary" class="winstreak-text">Win streak</p><br><br>
                <v-icon icon="mdi-fire" size="40"></v-icon>
                <v-icon icon="mdi-fire" size="40"></v-icon>
                <v-icon icon="mdi-fire" size="40"></v-icon>
              </div>
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
              <v-icon icon="mdi-robot-love" size="120" :color="currentPlayer === bot ? '#3f3f3f' : 'grey'"
                :class="currentPlayer === bot ? 'bounce' : ''"></v-icon><br>
              <h3 :style="currentPlayer === bot ? 'color: #3f3f3f;' : 'color: grey;'">Bot (O)</h3>
              <div>
                <p :style="{ fontSize: '110px', color: '#3f3f3f' }">1</p>
              </div>
            </v-col>
          </v-row>

          <v-divider class="mt-4"></v-divider>

          <v-row class="mt-4" v-if="isGameEnd">
            <v-col cols="12" md="12" class="text-center">
              <h1>{{ gameEndMessage }}</h1>
              <v-spacer></v-spacer>
              <v-btn @click="startGame()" color="primary" size="x-large">Next Game</v-btn>
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
          <v-btn-toggle v-model="gameModeToggle" color="primary" mandatory>
            <v-btn value="Easy">
              <v-icon icon="mdi-robot-happy" size="40" start></v-icon>
              <h2>Easy</h2>
            </v-btn>
            <v-btn value="Hard">
              <v-icon icon="mdi-robot-angry" size="40" start></v-icon>
              <h2>Hard</h2>
            </v-btn>
          </v-btn-toggle>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <div v-if="isGameEnd" class="gif-container">
      <img class="gif-left" src="/Wingame-left.gif" alt="Game end" />
      <img class="gif-right" src="/Wingame-right.gif" alt="Game end" />
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
      gameModeToggle: "Easy",

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
        this.gameEndMessage = "You is the winner!";
        this.winPlayer = this.currentPlayer;
        this.score = this.score + 1;
      } else if (winPlayer == this.bot) {
        this.isGameEnd = true;
        this.gameEndMessage = "Bot is the winner!";
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

    // Commond function
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
  height: 70vh;
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


.turn-toggle {
  pointer-events: none;
}

.bounce {
  animation: bounce 0.5s 2;
}

@keyframes bounce {

  from,
  to {
    transform: scale(1, 1);
  }

  25% {
    transform: scale(0.9, 1.1);
  }

  50% {
    transform: scale(1.1, 0.9);
  }

  75% {
    transform: scale(0.95, 1.05);
  }
}

.gif-container img {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  height: 100%;
}

.gif-left {
  left: 0;
}

.gif-right {
  right: 0;
}

.winstreak-text {
  background-color: #3f3f3f;
  border-radius: 10px;
  padding: 0px 10px;
  color: white;
  display: inline-block;
}
</style>
