import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Button } from 'antd';
import cloudLogo from '../assets/cloud_logo.png';

const Layout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <div onClick={() => navigate('/')} className="home">
            <img src={cloudLogo} alt="Cloud Logo" className="cloud-logo" />
            <span className="logo-text">MyCloud</span>
          </div>

          <div className="header__space"></div>

          <div className="nav">
            {!isAuthenticated ? (
              <>
                {location.pathname === '/' && (
                  <NavLink to="/register">
                    <Button type="primary">Регистрация</Button>
                  </NavLink>
                )}
                {location.pathname === '/' && (
                  <NavLink to="/login">
                    <Button type="default">Вход</Button>
                  </NavLink>
                )}
              </>
            ) : (
              <>
                <span>Здравствуйте, {user?.username}</span>
                <Button type="default" onClick={handleLogout}>Выход</Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          MyCloud ©{new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

export default Layout;
