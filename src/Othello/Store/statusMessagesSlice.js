import { createSlice } from '@reduxjs/toolkit'
import Constants from '../Constants'

const initialState = {
  value: []
}

  export const statusMessagesSlice = createSlice({
    name: 'statusMessages',
    initialState,
    reducers: {
      clear: (state) => {
        state.value = []
      },
      addMessage: (state, action) => {
        // console.log(action)
        const message = action.payload
        const last = state.value[state.value.length - 1]
        // console.log(message, last)
        if (message !== last) {
          state.value.push(message)
        }
        if (state.value.length > Constants.maxMessageCount) {
          state.value.shift()
        }
      }
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { clear, addMessage } = statusMessagesSlice.actions
  
  export default statusMessagesSlice.reducer