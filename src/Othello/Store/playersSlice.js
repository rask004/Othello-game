import { createSlice } from '@reduxjs/toolkit'
import Constants from '../Constants'

const initialState = {
    value: {
      players: Constants.defaultPlayers,
      activePlayerIndex: 0
    }
  }

  export const playersSlice = createSlice({
    name: 'playerData',
    initialState,
    reducers: {
      RESET: (state) => {
        state.value = Constants.defaultPlayers
      },
      CHANGE_OPPONENT: (state, action) => {
        const {opponentType} = action.payload
        state.value.players[Constants.aiPlayerIndex].type = opponentType
      },
      NEXT: (state) => {
        let n = state.value.activePlayerIndex + 1
        if (n >= state.value.players.length) {
          n = 0
        }
        state.value.activePlayerIndex = n
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { RESET, CHANGE_OPPONENT, NEXT } = playersSlice.actions
  
  export default playersSlice.reducer