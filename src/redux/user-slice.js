// user-slice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    darkMode: false
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;