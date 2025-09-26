import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';  
import { loginUser, logoutUser, registerUser } from './services/authServices';

export const loadUserFromToken = createAsyncThunk(
  'auth/loadUserFromToken',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue('No token');
    try {
      const response = await axios.get('http://localhost:8000/api/users/profile/', {
        headers: { Authorization: `Token ${token}` },
      });
      return { user: response.data, token };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message || 'Invalid token');
    }
  },
);

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  isLoading: false,
  error: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  selectors: {
    authState: (state) => state,
  },
  reducers: {
    clearError: (state) => {
      state.error = '';
    },
    logout: (state) => {  
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isAdmin = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.is_staff;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = '';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.is_staff;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        localStorage.removeItem('token');
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.isAdmin = action.payload.user.is_staff;
      })
      .addCase(loadUserFromToken.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAdmin = false;
        localStorage.removeItem('token');
      });
  },
});

export const { authState } = authSlice.selectors;
export const { clearError, logout } = authSlice.actions;

export { loginUser, logoutUser, registerUser };

export default authSlice.reducer;
