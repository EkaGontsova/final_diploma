import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const updateAdminStatus = createAsyncThunk(
  'users/updateAdminStatus',
  async ({ userId, isStaff }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.patch(
        `${API_BASE}/users/${userId}/status/`,
        { is_staff: isStaff },
        {
          headers: { Authorization: `Token ${token}` },
        },
      );
      return response.data;
    } catch {
      return rejectWithValue('Не удалось обновить статус администратора');
    }
  },
);

export const getUsersList = createAsyncThunk(
  'users/getList',
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_BASE}/users/`, {
        headers: { Authorization: `Token ${token}` },
      });
      return response.data;
    } catch {
      return rejectWithValue('Не удалось загрузить список пользователей');
    }
  },
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API_BASE}/users/${userId}/delete/`, {
        headers: { Authorization: `Token ${token}` },
      });
      return userId;
    } catch {
      return rejectWithValue('Не удалось удалить пользователя');
    }
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateAdminStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(
          (user) => user.id === action.payload.id,
        );
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(updateAdminStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getUsersList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.results;
        state.count = action.payload.count;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(
          (user) => user.id !== action.payload,
        );
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = usersSlice.actions;

export default usersSlice.reducer;
