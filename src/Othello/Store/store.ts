import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './boardSlice'
import playersReducer from './playersSlice'
import gameStartedReducer from './gameStartedSlice'
import statusMessagesReducer from './statusMessagesSlice'

export default configureStore({
  reducer: {
    board: boardReducer,
    playerData: playersReducer,
    gameStarted: gameStartedReducer,
    statusMessages: statusMessagesReducer,
  },
  devTools: true
})