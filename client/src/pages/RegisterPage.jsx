import { Link } from "react-router-dom";
import "../styles/auth.css";

function RegisterPage() {
  return (
    <div className="auth-container">
      <form className="auth-form">
        <h1>Register</h1>

        <input type="text" placeholder="Name" />

        <input type="email" placeholder="Email" />

        <input type="password" placeholder="Password" />

        <button type="submit">Register</button>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;
