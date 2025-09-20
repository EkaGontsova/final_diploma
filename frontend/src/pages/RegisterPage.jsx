import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { registerUser, clearError } from "../store/authSlice";

const RegisterPage = ({
  title = "Регистрация",
  buttonText = "Зарегистрироваться",
}) => {
  const { isAuthenticated, error, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState(""); // изменено с login
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/files");
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ username, email, password, full_name: fullName }));
  };

  return (
    <div className="page-center" style={{ padding: 20 }}>
      <h1>{title}</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Полное имя"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />
        <input
          type="text"
          placeholder="Логин"
          value={username}           // изменено с login
          onChange={(e) => setUsername(e.target.value)} // изменено
          required
          autoComplete="username"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <button type="submit" disabled={isLoading}>
          {buttonText}
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
      <p>
        Уже есть аккаунт? <Link to="/login">Войдите</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
