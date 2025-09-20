import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadUserFromToken } from './store/authSlice';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import FilesPage from './pages/FilesPage';
import AdminPage from './pages/AdminPage';
import ErrorPage from './pages/ErrorPage';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromToken());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="files" element={<FilesPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Route>
    </Routes>
  );
}

export default App;
