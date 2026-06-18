import { Link } from "react-router-dom";
import Button from "../components/Button";
import "../styles/home.css";

function HomePage() {
  return (
    <div className="home">
      <h1>InterPrep</h1>

      <Link to="/register">
        <Button text="Get Started" />
      </Link>

      <p>
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>
    </div>
  );
}

export default HomePage;
