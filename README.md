# Tic Tac Toe
A simple and interactive Tic Tac Toe game built with Vue 3 and styled using Vuetify 3. This project includes features like user authentication using Firebase (Google/Github login), scorekeeping, and a bot opponent with varying difficulty levels.

## Project setup
* Node.js (>=14.x)

## Steps
1. Clone the repository
```
git clone https://github.com/onamonmild/tictactoe-assignment.git
cd tictactoe-vue
```
2. Install
```
npm install
```
3. Run application
```
npm run serve
```

## How to use
1. Click `Enter`
2. Login (with Anonymous, Google or Github)
3. Click on any empty in 9x9 cell to move in your turn and then wait for bot turn
4. Who got align three symbols horizontally, vertically, or diagonally wins the game
* If you win, you got +1 score
* If bot win, you lose -1 score
* If you win with 3 streak, you got an extra +1 score
5. After game end. Click `Next game` for continue to next game
6. Click `Logout` at the top-right for logging out
