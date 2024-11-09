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
import { ref, computed } from "vue";

export default {
  name: "TicTacToe",
  setup() {
    const board = ref(Array(9).fill(null)); // Tic Tac Toe board (9 cells)
    const isGameOver = ref(false); // Track if the game is over
    const winner = ref(null); // Winner can be 'X', 'O', or null
    const currentPlayer = ref("X"); // Start with 'X'

    const makeMove = (index) => {
      if (board.value[index] || isGameOver.value) return; // Ignore invalid moves
      board.value[index] = currentPlayer.value;

      // Check for winner after the move
      if (checkWinner(board.value, currentPlayer.value)) {
        winner.value = currentPlayer.value;
        isGameOver.value = true;
      } else if (board.value.every(cell => cell !== null)) {
        // Check for draw
        isGameOver.value = true;
      } else {
        // Switch to the other player and let the bot play
        currentPlayer.value = currentPlayer.value === "X" ? "O" : "X";
        if (currentPlayer.value === "O") {
          botMove();
        }
      }
    };

    const botMove = () => {
      const bestMove = findBestMove(board.value);
      setTimeout(() => makeMove(bestMove), 500); // Simulate bot thinking
    };

    const findBestMove = (board) => {
      let bestVal = -Infinity;
      let bestMove = -1;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = "O"; // Make the bot's move
          let moveVal = minimax(board, false);
          board[i] = null; // Undo the move

          if (moveVal > bestVal) {
            bestMove = i;
            bestVal = moveVal;
          }
        }
      }

      return bestMove;
    };

    const minimax = (board, isMaximizing) => {
      const scores = {
        "X": -1,
        "O": 1,
        "draw": 0
      };

      const winner = checkWinner(board);
      if (winner) {
        return scores[winner];
      }

      if (board.every(cell => cell !== null)) {
        return scores["draw"]; // If the board is full, it's a draw
      }

      let bestScore = isMaximizing ? -Infinity : Infinity;

      for (let i = 0; i < board.length; i++) {
        if (board[i] === null) {
          board[i] = isMaximizing ? "O" : "X"; // Try both 'X' and 'O'
          const score = minimax(board, !isMaximizing);
          board[i] = null; // Undo move

          bestScore = isMaximizing
            ? Math.max(score, bestScore)
            : Math.min(score, bestScore);
        }
      }

      return bestScore;
    };

    const checkWinner = (board) => {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
      ];

      for (let pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a]; // Return the winner 'X' or 'O'
        }
      }

      return null;
    };

    const winnerMessage = computed(() => {
      if (winner.value) {
        return winner.value === "X" ? "You Win!" : "Bot Wins!";
      } else if (board.value.every(cell => cell !== null)) {
        return "It's a Draw!";
      }
      return '';
    });

    const restartGame = () => {
      board.value = Array(9).fill(null);
      isGameOver.value = false;
      winner.value = null;
      currentPlayer.value = "X"; // Reset to X as the first player
    };

    return {
      board,
      isGameOver,
      currentPlayer,
      makeMove,
      restartGame,
      winnerMessage,
    };
  },
};
</script>

<style scoped>
.v-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
