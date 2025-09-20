import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  return (
    <div className="page-center">
      <h1>Добро пожаловать в облачное хранилище MyCloud</h1>
      {isAuthenticated ? (
        <p>
          Здравствуйте, {user?.username}! Перейдите в{' '}
          <Link to="/files">файловое хранилище</Link>.
        </p>
      ) : (
        <p>
          Пожалуйста, <Link to="/login">войдите</Link> или{' '}
          <Link to="/register">зарегистрируйтесь</Link>
        </p>
      )}
    </div>
  );
};

export default HomePage;
