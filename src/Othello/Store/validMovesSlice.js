import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: [],
  }

  export const validMovesSlice = createSlice({
    name: 'validMoves',
    initialState,
    reducers: {
      UPDATE: (state, action) => {
        const {moves} = action.payload
        state.value = moves
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { UPDATE } = validMovesSlice.actions
  
  export default validMovesSlice.reducer