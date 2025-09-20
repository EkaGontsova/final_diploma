import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';

const LoginPage = ({ title = "Вход", buttonText = "Войти" }) => {
  const { isAuthenticated, user, error, isLoading } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState(''); // изменено с login
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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ username, password })); // изменено с login
  };

  return (
    <div className="page-center" style={{ padding: 20 }}>
      <h1>{title}</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Логин"
          value={username} // изменено с login
          onChange={e => setUsername(e.target.value)} // изменено
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
      {error && <p className="error-message">{error}</p>}
      <p>
        Нет аккаунта? <Link to="/register">Зарегистрируйтесь</Link>
      </p>
    </div>
  );
};

export default LoginPage;
