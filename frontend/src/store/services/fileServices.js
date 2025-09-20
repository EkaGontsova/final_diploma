import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const fetchFiles = async (token, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE}/files/`, {
      headers: { Authorization: `Token ${token}` },
      params,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Ошибка загрузки файлов');
  }
};

export const uploadFile = async (file, folderId, token) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (folderId) formData.append('folder', folderId);

    const response = await axios.post(`${API_BASE}/files/`, formData, {
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Ошибка загрузки файла');
  }
};

export const deleteFile = async (fileId, token) => {
  try {
    const response = await axios.delete(`${API_BASE}/files/${fileId}/`, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Ошибка удаления файла');
  }
};

export const changeFile = async (fileId, { file_name, comment }, token) => {
  try {
    const body = {};
    if (file_name !== undefined) body.file_name = file_name;
    if (comment !== undefined) body.comment = comment;

    const response = await axios.patch(`${API_BASE}/files/${fileId}/`, body, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Ошибка редактирования файла');
  }
};

export const getFileLink = async (fileId, token) => {
  try {
    const response = await axios.get(`${API_BASE}/files/${fileId}/link/`, {
      headers: { Authorization: `Token ${token}` },
    });
    return response.data.link;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Ошибка генерации ссылки');
  }
};
