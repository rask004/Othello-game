import { createSlice } from '@reduxjs/toolkit'
import Constants from '../Constants'


 const initialiseBoard = () => {
    let spaces = [];
    for (let i = 0; i < Constants.boardSize; i++) {
        const row = []
        for (let j = 0; j < Constants.boardSize; j++) {
            row.push(Constants.emptySpace)
        }
        spaces.push(row)
    }

    spaces[3][3] = Constants.defaultPlayers[Constants.userPlayerIndex]
    spaces[3][4] = Constants.defaultPlayers[Constants.aiPlayerIndex]
    spaces[4][3] = Constants.defaultPlayers[Constants.aiPlayerIndex]
    spaces[4][4] = Constants.defaultPlayers[Constants.userPlayerIndex]
    return spaces;
}

const initialState = {
    value: initialiseBoard(),
  }

  export const boardSlice = createSlice({
    name: 'board',
    initialState,
    reducers: {
      RESET: (state) => {
        state.value = initialiseBoard()
      },
      UPDATE: (state, action ) => {
        const {x, y, item} = action.payload
        state.value[y][x] = item
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { RESET, UPDATE } = boardSlice.actions
  
  export default boardSlice.reducer