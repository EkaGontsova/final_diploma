import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/users';

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password, full_name }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/signup/`, {
        username,
        full_name,
        email,
        password,
      });
      return response.data;
    } catch (err) {
  const errors = err.response?.data;
  if (errors) {
    if (errors.username) {
      return rejectWithValue('Ошибка! Пользователь с таким логином уже существует');
    }
    if (errors.email) {
      return rejectWithValue('Ошибка! Пользователь с таким email уже существует');
    }
    let message = '';
    for (const key in errors) {
      if (Array.isArray(errors[key])) {
        message += `${key}: ${errors[key].join(' ')}\n`;
      } else {
        message += `${key}: ${errors[key]}\n`;
      }
    }
    return rejectWithValue(message.trim());
  }
  return rejectWithValue('Ошибка регистрации. Попробуйте позже.');
}
    }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE}/login/`, {
        username: username,
        password,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.detail || 'Ошибка! Неправильный логин или пароль');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    return {};
  }
);
