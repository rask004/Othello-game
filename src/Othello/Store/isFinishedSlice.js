import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    value: false,
  }

  export const isFinishedSlice = createSlice({
    name: 'isFinished',
    initialState,
    reducers: {
      RESET: (state) => {
        state.value = false
      },
      FINISH: (state) => {
        state.value = true
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { RESET, FINISH } = isFinishedSlice.actions
  
  export default isFinishedSlice.reducer