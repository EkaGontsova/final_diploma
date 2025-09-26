import { combineReducers, configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import usersSlice from './usersSlice';
import filesSlice from './filesSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  users: usersSlice,
  files: filesSlice,
});

export const store = configureStore({
  reducer: rootReducer,
});
