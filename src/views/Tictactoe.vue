<template>
    <v-container>
      <div class="board">
        <div v-for="(cell, index) in board" :key="index" class="cell" @click="makeMove(index)">
          {{ cell }}
        </div>
      </div>
      <div>
        <p>Score: {{ score }}</p>
        <p>Win Streak: {{ winStreak }}</p>
      </div>
    </v-container>
  </template>
  
  <script>
  export default {
    name: 'TictactoeView',
    data() {
      return {
        board: Array(9).fill(''),
        currentPlayer: 'X',
        score: 0,
        winStreak: 0,
      };
    },
    methods: {
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
  