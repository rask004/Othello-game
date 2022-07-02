import { configureStore } from '@reduxjs/toolkit'
import boardReducer from './boardSlice'
import playersReducer from './playersSlice'
import isFinishedReducer from './isFinishedSlice'
import validMovesReducer from './validMovesSlice'

export default configureStore({
  reducer: {
    board: boardReducer,
    playerData: playersReducer,
    isFinished: isFinishedReducer,
    validMoves: validMovesReducer,
  }
})