import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './boardSlice'
import playersReducer from './playersSlice'
import gameStartedReducer from './gameStartedSlice'

export default configureStore({
  reducer: {
    board: boardReducer,
    playerData: playersReducer,
    gameStarted: gameStartedReducer,
  }
})