import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const getFilesList = createAsyncThunk(
  'files/getList',
  async ({ userId } = {}, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const params = userId ? { user_id: userId } : {};
      const response = await axios.get(`${API_BASE}/files/`, {
        headers: { Authorization: `Token ${token}` },
        params,
      });
      return response.data.results || response.data;
    } catch {
      return rejectWithValue('Не удалось загрузить список файлов');
    }
  },
);

export const uploadFile = createAsyncThunk(
  'files/upload',
  async ({ file, folderId = null }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();
      formData.append('file', file);
      if (folderId) formData.append('folder_id', folderId);

      const response = await axios.post(`${API_BASE}/files/`, formData, {
        headers: { Authorization: `Token ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch {
      return rejectWithValue('Не удалось загрузить файл');
    }
  },
);

export const deleteFile = createAsyncThunk(
  'files/delete',
  async (fileId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await axios.delete(`${API_BASE}/files/${fileId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      return fileId;
    } catch {
      return rejectWithValue('Не удалось удалить файл');
    }
  },
);

export const changeFile = createAsyncThunk(
  'files/change',
  async ({ fileId, file_name, comment }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const body = {};
      if (file_name !== undefined) body.file_name = file_name;
      if (comment !== undefined) body.comment = comment;

      const response = await axios.patch(
        `${API_BASE}/files/${fileId}/`,
        body,
        { headers: { Authorization: `Token ${token}` } },
      );
      return response.data;
    } catch {
      return rejectWithValue('Не удалось отредактировать файл');
    }
  },
);

export const downloadFile = createAsyncThunk(
  'files/download',
  async (fileId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const metaResponse = await axios.get(`${API_BASE}/files/${fileId}/`, {
        headers: { Authorization: `Token ${token}` },
      });
      const fileName = metaResponse.data.file_name || 'file';

      const response = await axios.get(`${API_BASE}/files/${fileId}/download/`, {
        headers: { Authorization: `Token ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return fileId;
    } catch {
      return rejectWithValue('Не удалось скачать файл');
    }
  },
);

export const getFileLink = createAsyncThunk(
  'files/getLink',
  async (fileId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_BASE}/files/${fileId}/link/`, {
        headers: { Authorization: `Token ${token}` },
      });
      return response.data.link;
    } catch {
      return rejectWithValue('Не удалось сгенерировать ссылку');
    }
  },
);

export const viewFile = createAsyncThunk(
  'files/view',
  async (fileId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${API_BASE}/files/${fileId}/view/`, {
        headers: { Authorization: `Token ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(response.data);
      const newWindow = window.open(url, '_blank');

      if (!newWindow) {
        alert('Попап заблокирован браузером. Разрешите попапы для этого сайта.');
      }

      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
      return fileId;
    } catch {
      return rejectWithValue('Не удалось открыть файл для просмотра');
    }
  },
);

const filesSlice = createSlice({
  name: 'files',
  initialState: {
    files: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.status = 'loading';
      state.error = null;
    };
    const handleRejected = (state, action) => {
      state.status = 'failed';
      state.error = action.payload || action.error.message;
    };

    builder
      .addCase(getFilesList.pending, handlePending)
      .addCase(getFilesList.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.files = action.payload;
      })
      .addCase(getFilesList.rejected, handleRejected);

    builder
      .addCase(uploadFile.pending, handlePending)
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.files.push(action.payload);
      })
      .addCase(uploadFile.rejected, handleRejected);

    builder
      .addCase(deleteFile.pending, handlePending)
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.files = state.files.filter((file) => file.id !== action.payload);
      })
      .addCase(deleteFile.rejected, handleRejected);

    builder
      .addCase(changeFile.pending, handlePending)
      .addCase(changeFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.files.findIndex((file) => file.id === action.payload.id);
        if (index !== -1) {
          state.files[index] = action.payload;
        }
      })
      .addCase(changeFile.rejected, handleRejected);

    builder
      .addCase(downloadFile.pending, handlePending)
      .addCase(downloadFile.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(downloadFile.rejected, handleRejected);

    builder
      .addCase(getFileLink.pending, handlePending)
      .addCase(getFileLink.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(getFileLink.rejected, handleRejected);

    builder
      .addCase(viewFile.pending, handlePending)
      .addCase(viewFile.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(viewFile.rejected, handleRejected);
  },
});

export const { clearError } = filesSlice.actions;
export default filesSlice.reducer;
