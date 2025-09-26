import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  getUsersList,
  deleteUser,
  updateAdminStatus,
  clearError,
} from '../store/usersSlice';
import Loading from '../components/Loading';
import { message } from 'antd';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.users);
  const { isAuthenticated, user: currentUser } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (isAuthenticated && currentUser?.is_staff) {
      dispatch(getUsersList())
        .unwrap()
        .catch(() => {
          message.error('Ошибка загрузки списка пользователей');
        });
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, isAuthenticated, currentUser?.is_staff]);

  useEffect(() => {
    if (error) {
      message.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  if (!isAuthenticated) {
    return (
      <div className="page-center" style={{ padding: 20 }}>
        <h1>Нет доступа</h1>
        <p style={{ color: '#ccc' }}>
          Пожалуйста,{' '}
          <Link to="/login" style={{ color: '#8ef064', textDecoration: 'none' }}>
            войдите
          </Link>{' '}
          для доступа к административной панели
        </p>
      </div>
    );
  }
  if (!currentUser?.is_staff) {
    return (
      <div className="page-center" style={{ padding: 20 }}>
        <h1>Админ панель</h1>
        <p style={{ color: '#ccc' }}>У вас нет доступа к этой странице.</p>
      </div>
    );
  }

  const formatSizeMB = (sizeInBytes) => {
    if (!sizeInBytes) return '0 MB';
    return (sizeInBytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      dispatch(deleteUser(userId))
        .unwrap()
        .then(() => {
          dispatch(getUsersList())
            .unwrap()
            .catch(() => {
              message.error('Ошибка обновления списка пользователей');
            });
          message.success('Пользователь удалён');
        })
        .catch(() => {
          message.error('Ошибка при удалении пользователя');
        });
    }
  };

  const handleToggleAdmin = (user) => {
    const newStatus = !user.is_staff;
    dispatch(updateAdminStatus({ userId: user.id, isStaff: newStatus }))
      .unwrap()
      .then(() => {
        dispatch(getUsersList())
          .unwrap()
          .catch(() => {
            message.error('Ошибка обновления списка пользователей');
          });
        message.success('Статус администратора обновлен');
      })
      .catch(() => {
        message.error('Ошибка при обновлении статуса администратора');
      });
  };

  return (
    <div className="admin-page">
      <h1>Админ панель</h1>
      {loading && <Loading />}
      {error && <p className="error-message">{error}</p>}
      <ul className="user-grid">
        {users.map((user) => (
          <li key={user.id} className="user-card">
            <div>
              <strong>{user.username}</strong> ({user.full_name}) - {user.email}
            </div>
            <div>Админ: {user.is_staff ? 'Да' : 'Нет'}</div>
            <div>Путь к хранилищу: {user.storage_path}</div>
            <div>
              Файлов: {user.files_count}, Общий размер:{' '}
              {formatSizeMB(user.total_size)}
            </div>
            <div className="user-card-actions">
              <Link
                to={`/files?user_id=${user.id}`}
                className="manage-files-link"
              >
                Управлять файлами
              </Link>
              <div className="user-card-buttons">
                <button onClick={() => handleToggleAdmin(user)}>
                  Сменить статус
                </button>
                <button onClick={() => handleDeleteUser(user.id)}>
                  Удалить
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
