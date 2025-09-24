import { Link } from "react-router-dom";

const ErrorPage = () => (
  <div className="page-center" style={{ padding: 20 }}>
    <h1
      style={{
        color: "#fff",
        marginBottom: 20,
      }}
    >
      404 - Страница не найдена
    </h1>
    <p
      style={{
        color: "#ccc",
        marginBottom: 20,
      }}
    >
      Такой страницы не существует. Возможно, вы перешли по неправильной ссылке
    </p>
    <Link
      to="/"
      style={{
        color: "#8ef064",
        textDecoration: "none",
        fontSize: "18px",
      }}
    >
      На главную
    </Link>
  </div>
);

export default ErrorPage;
