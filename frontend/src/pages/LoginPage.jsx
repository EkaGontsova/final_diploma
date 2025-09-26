import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import { message } from 'antd';

const LoginPage = ({ title = 'Вход', buttonText = 'Войти' }) => {
  const { isAuthenticated, user, error, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      if (user?.is_staff) {
        navigate('/admin');
      } else {
        navigate('/files');
      }
    }
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, user?.is_staff, navigate, dispatch]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }))
      .unwrap()
      .catch(err => {
        const errorMsg = err?.message || err || 'Ошибка при входе';
        message.error(errorMsg);
      });
  };

  return (
    <div className="page-center" style={{ padding: 20 }}>
      <h1>{title}</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          autoComplete="current-password"
        />
        <button type="submit" disabled={isLoading}>{buttonText}</button>
      </form>
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
};

export default LoginPage;
