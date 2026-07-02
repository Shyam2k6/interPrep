import { Link } from "react-router-dom";
import { Button } from "../components/ui";
import "../styles/home.css";

function HomePage() {
  return (
    <div className="home">
      <h1>InterPrep</h1>

      <Link to="/register">
        <Button>Get Started</Button>
      </Link>

      <p>
        Already have an account?
        <Link to="/login"> Login</Link>
      </p>
    </div>
  );
}

export default HomePage;
