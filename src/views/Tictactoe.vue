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
      <v-col cols="12" md="5">
        <v-card class="sub-main-card" elevation="5">
          <v-row>
            <v-col cols="12" md="12">
              <v-btn-toggle v-model="currentPlayer" color="primary" mandatory class="turn-toggle">
                <v-btn :value="human">
                  <v-icon icon="mdi-account" size="40" start></v-icon>
                  <h2>'X' Turn</h2>
                </v-btn>
                <v-btn :value="bot">
                  <h2>'O' Turn</h2>
                  <v-icon icon="mdi-robot" size="40" end></v-icon>
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>

          <v-divider></v-divider>
          <v-row align="start" justify="center" style="padding-top: 3%; padding-bottom: 3%">
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

              <v-row align="center" justify="center" style="padding-top: 2%;">
                <v-col cols="auto" style="display: flex; align-items: baseline;">
                  <v-icon icon="mdi-robot-happy" size="40" start :color="!isHardMode ? 'primary' : 'grey'"></v-icon>
                  <span style="font-size: 25px; text-align: right;"
                    :style="{ color: !isHardMode ? $vuetify.theme.primary : 'grey' }">Easy</span>
                </v-col>

                <v-col cols="auto">
                  <v-switch v-model="isHardMode" inset style="display: flex; "></v-switch>
                </v-col>

                <v-col cols="auto" style="display: flex; align-items: baseline;">
                  <span style="font-size: 25px; text-align: left;"
                    :style="{ color: isHardMode ? $vuetify.theme.primary : 'grey' }">Hard</span>
                  <v-icon icon="mdi-robot-angry" size="40" end :color="isHardMode ? 'primary' : 'grey'"></v-icon>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-divider></v-divider>

          <v-row class="mt-1" v-if="isGameEnd">
            <v-col cols="12" md="12" class="text-center">
              <span style="font-size: 30px;">{{ gameEndMessage }}</span>
              <v-spacer></v-spacer>
              <v-btn @click="startGame()" color="primary" size="x-large">Next Game</v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="sub-main-card" elevation="5">
          <v-container >
            <v-avatar v-if="userPhotoURL" style="height: 100px; width: 100px;">
              <img :src="userPhotoURL" alt="User Photo" class="avatar-class"/>
            </v-avatar>
            <v-avatar v-else size="100">
              <v-icon size="100">mdi-account</v-icon>
            </v-avatar><br>
            <span style="font-size: 30px;">{{ displayName }}</span>
            <v-divider></v-divider>

            <v-table density="compact">
              <thead>
                <!-- <tr>
                  <th class="profile-topic">
                    Best score
                  </th>
                  <th class="profile-value">
                    {{ bestScore }}
                  </th>
                </tr> -->
                <tr>
                  <th class="profile-topic">
                    Score
                  </th>
                  <th class="profile-value">
                    {{ score }}
                  </th>
                </tr>
                <tr>
                  <th class="profile-topic">
                    Win streak
                  </th>
                  <th class="profile-value">
                    <v-icon icon="mdi-fire" :color="winStreak >= 1 ? 'orange' : 'grey'"></v-icon>
                    <v-icon icon="mdi-fire" :color="winStreak >= 2 ? 'orange' : 'grey'"></v-icon>
                    <v-icon icon="mdi-fire" :color="winStreak >= 3 ? 'orange' : 'grey'"></v-icon>
                  </th>
                </tr>
                <tr>
                  <th class="profile-topic">
                    User win
                  </th>
                  <th class="profile-value">
                    {{ userWinCount }}
                  </th>
                </tr>
                <tr>
                  <th class="profile-topic">
                    Bot win
                  </th>
                  <th class="profile-value">
                    {{ botWinCount }}
                  </th>
                </tr>
                <tr>
                  <th class="profile-topic">
                    Draw
                  </th>
                  <th class="profile-value">
                    {{ drawCount }}
                  </th>
                </tr>
              </thead>
            </v-table>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <div v-if="isGameEnd && !isGameDraw && currentPlayer == human" class="gif-container">
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
      userPhotoURL: null,

      // Board game
      bot: "O",
      human: "X",
      currentPlayer: "X",
      winPlayer: null,
      isGameEnd: false,
      isGameDraw: false,
      isHardMode: false,

      botWinCount: 0,
      userWinCount: 0,
      drawCount: 0,

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
      console.log(user);
      if (user) {
        this.user = user;
        if (user.displayName) {
          this.displayName = user.displayName;
          this.userPhotoURL = user.photoURL;
        } else if (user.isAnonymous) {
          this.displayName = "Anonymous";
          this.userPhotoURL = null;
        } else {
          this.displayName = "Unknown user";
        }
      } else {
        this.displayName = null;
        this.userPhotoURL = null;
      }
    });
  },

  methods: {
    // User
    logout() {
      auth.signOut().then(() => {
        this.user = null;
        this.displayName = null;
        this.userPhotoURL = null;
        this.score = null;
        this.$router.push("/");

        this.botWinCount = 0;
        this.userWinCount = 0;
        this.drawCount = 0;
      });
    },

    // Board game
    startGame() {
      this.isGameEnd = false;
      this.isGameDraw = false;
      this.board = Array(9).fill(null);
      this.currentPlayer = this.human;
      this.winPlayer = null;
      this.gameEndMessage = "";

      if (this.winStreak == 3) {
        this.winStreak = 0;
      }

    },

    async selectMoveIndex(index) {
      this.board[index] = this.currentPlayer;

      let winPlayer = await this.calculateWinner(this.board, this.currentPlayer);
      if (winPlayer == this.human) {
        this.isGameEnd = true;
        this.userWinCount += 1;
        this.gameEndMessage = "You are the winner!";
        this.winPlayer = this.currentPlayer;
        this.score += 1;
        this.winStreak = this.winStreak + 1;
        if (this.winStreak == 3) {
          this.gameEndMessage = "You are the winner! (+1 extra score)";
          this.score += 1;
        }
      } else if (winPlayer == this.bot) {
        this.isGameEnd = true;
        this.botWinCount += 1;
        this.gameEndMessage = "Bot is the winner!";
        this.winPlayer = this.currentPlayer;
        this.score = this.score <= 0 ? 0 : this.score - 1;
        this.winStreak = 0;
      } else if (await this.calculateDrawGame(this.board) !== null) {
        this.isGameDraw = true;
        this.isGameEnd = true;
        this.drawCount += 1;
        this.gameEndMessage = "Draw!";
      } else {
        await this.switchTurn();
      }
    },

    botMove(board) {
      let index = "";
      if (!this.isHardMode) {
        const emptyIndex = [];
        for (let i = 0; i < board.length; i++) {
          if (board[i] === null || board[i] === "") {
            emptyIndex.push(i);
          }
        }

        index = emptyIndex[Math.floor(Math.random() * emptyIndex.length)];
      } else {
        index = this.findBestMove(board);
      }
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
        if (
          board[x] !== "" &&
          board[x] !== null &&
          board[x] == board[y] &&
          board[y] == board[z]
        ) {
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

    findBestMove(board) {
      let bestVal = -Infinity;
      let bestMove = -1;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = this.bot;
          let moveVal = this.minimax(board, 0, false);
          board[i] = null;

          if (moveVal > bestVal) {
            bestMove = i;
            bestVal = moveVal;
          }
        }
      }
      return bestMove;
    },

    minimax(board, depth, isMaximizingPlayer) {
      let score = this.evaluate(board);

      if (score === 10) {
        return score - depth;
      }

      if (score === -10) {
        return score + depth;
      }

      if (this.calculateDrawGame(board)) {
        return 0;
      }

      if (isMaximizingPlayer) {
        let best = -Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === null) {
            board[i] = this.bot;
            best = Math.max(best, this.minimax(board, depth + 1, !isMaximizingPlayer));
            board[i] = null;
          }
        }
        return best;
      } else {
        let best = Infinity;
        for (let i = 0; i < board.length; i++) {
          if (board[i] === null) {
            board[i] = this.human;
            best = Math.min(best, this.minimax(board, depth + 1, !isMaximizingPlayer));
            board[i] = null;
          }
        }
        return best;
      }
    },

    evaluate(board) {
      for (let item of this.winBoard) {
        const [x, y, z] = item;
        if (board[x] === this.bot && board[y] === this.bot && board[z] === this.bot) {
          return 10;
        } else if (board[x] === this.human && board[y] === this.human && board[z] === this.human) {
          return -10;
        }
      }
      return 0;
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
  height: 75vh;
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


.profile-topic {
  font-size: 20px;
  min-width: 120px;
  text-align: left;
}

.profile-value {
  font-size: 20px;
  margin-left: 20px;
  text-align: right;
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

.avatar-class {
  width: 100px;
  height: 100px;
}
</style>
