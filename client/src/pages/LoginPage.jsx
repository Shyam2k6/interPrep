import { Link } from "react-router-dom";
import "../styles/auth.css";

function LoginPage() {
  return (
    <div className="auth-container">
      <form className="auth-form">
        <h1>Login</h1>

        <input type="email" placeholder="Email" />

        <input type="password" placeholder="Password" />

        <button type="submit">Login</button>

        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
