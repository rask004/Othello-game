import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: false,
  }

  export const gameStartedSlice = createSlice({
    name: 'gameStarted',
    initialState,
    reducers: {
      resetGame: (state) => {
        state.value = false
      },
      startGame: (state) => {
        state.value = true
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { resetGame, startGame } = gameStartedSlice.actions
  
  export default gameStartedSlice.reducer