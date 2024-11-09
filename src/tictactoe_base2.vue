<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" sm="6" md="4">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="text-h5">Tic Tac Toe - Human vs Bot</v-card-title>
          <v-divider></v-divider>
          
          <v-row class="mt-4">
            <v-col v-for="(cell, index) in board" :key="index" cols="4">
              <v-btn
                class="text-h4"
                :style="{ height: '100px', width: '100px', fontSize: '32px' }"
                color="primary"
                @click="makeMove(index)"
                :disabled="isGameOver || cell !== null"
              >
                {{ cell }}
              </v-btn>
            </v-col>
          </v-row>

          <v-divider class="mt-4"></v-divider>

          <v-row class="mt-4" v-if="isGameOver">
            <v-col class="text-center">
              <v-btn @click="restartGame" color="secondary">Restart Game</v-btn>
            </v-col>
          </v-row>

          <v-row class="mt-4" v-if="isGameOver">
            <v-col class="text-center">
              <p>{{ winnerMessage }}</p>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TicTacToe",
  data() {
    return {
      board: Array(9).fill(null),  // Board for Tic Tac Toe (9 cells)
      isGameOver: false,  // Track if the game is over
      winner: null,  // Winner can be 'X', 'O', or null
      currentPlayer: "X",  // Start with 'X'
    };
  },
  computed: {
    winnerMessage() {
      if (this.winner) {
        return this.winner === "X" ? "You Win!" : "Bot Wins!";
      } else if (this.board.every(cell => cell !== null)) {
        return "It's a Draw!";
      }
      return '';
    }
  },
  methods: {
    makeMove(index) {
      if (this.board[index] || this.isGameOver) return;  // Ignore invalid moves
      this.$set(this.board, index, this.currentPlayer);  // Update the board

      // Check for winner after the move
      if (this.checkWinner(this.board, this.currentPlayer)) {
        this.winner = this.currentPlayer;
        this.isGameOver = true;
      } else if (this.board.every(cell => cell !== null)) {
        // Check for draw
        this.isGameOver = true;
      } else {
        // Switch to the other player and let the bot play
        this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
        if (this.currentPlayer === "O") {
          this.botMove();
        }
      }
    },

    botMove() {
      const bestMove = this.findBestMove(this.board);
      setTimeout(() => this.makeMove(bestMove), 500);  // Simulate bot thinking
    },

    findBestMove(board) {
      let bestVal = -Infinity;
      let bestMove = -1;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O"; // Make the bot's move
          let moveVal = this.minimax(board, false);
          board[i] = null; // Undo the move

          if (moveVal > bestVal) {
            bestMove = i;
            bestVal = moveVal;
          }
        }
      }

      return bestMove;
    },

    minimax(board, isMaximizing) {
      const scores = {
        "X": -1,
        "O": 1,
        "draw": 0
      };

      const winner = this.checkWinner(board);
      if (winner) {
        return scores[winner];
      }

      if (board.every(cell => cell !== null)) {
        return scores["draw"];  // If the board is full, it's a draw
      }

      let bestScore = isMaximizing ? -Infinity : Infinity;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = isMaximizing ? "O" : "X";  // Try both 'X' and 'O'
          const score = this.minimax(board, !isMaximizing);
          board[i] = null;  // Undo move

          bestScore = isMaximizing
            ? Math.max(score, bestScore)
            : Math.min(score, bestScore);
        }
      }

      return bestScore;
    },

    checkWinner(board) {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],  // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8],  // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
      ];

      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];  // Return the winner 'X' or 'O'
        }
      }

      return null;
    },

    restartGame() {
      this.board = Array(9).fill(null);
      this.isGameOver = false;
      this.winner = null;
      this.currentPlayer = "X";  // Reset to X as the first player
    }
  }
};
</script>

<style scoped>
.v-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
