// store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user-slice';

const store = configureStore({
  reducer: {
    user: userReducer,
    // Add more slices as needed
  },
});

export default store;