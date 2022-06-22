import { createSlice } from '@reduxjs/toolkit'
import Constants from '../Constants'


const initialState = {
    value: Constants.defaultPlayers,
  }

  export const playersSlice = createSlice({
    name: 'players',
    initialState,
    reducers: {
      RESET: (state) => {
        
        state.value = Constants.defaultPlayers
      },
      CHANGE_OPPONENT: (state, action) => {
        const {opponentType} = action.payload
        state.value[Constants.aiPlayerIndex].type = opponentType
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { RESET, CHANGE_OPPONENT } = playersSlice.actions
  
  export default playersSlice.reducer