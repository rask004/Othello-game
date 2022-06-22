import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './boardSlice'
import playersReducer from './playersSlice'
import isFinishedReducer from './isFinishedSlice'

export const store = configureStore({
  reducer: {
    board: boardReducer,
    players: playersReducer,
    isFinished: isFinishedReducer,
  }
})