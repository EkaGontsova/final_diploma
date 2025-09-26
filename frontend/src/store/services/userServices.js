import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

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
