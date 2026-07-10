import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <div>
        <h2>SparkleWash</h2>
      </div>

      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>

        <li>
          <Link to="/about">About</Link>
        </li>

        <li>
          <Link to="/services">Services</Link>
        </li>

        <li>
          <Link to="/contact">Contact</Link>
        </li>

        <li>
          <Link to="/login">Login</Link>
        </li>

        <li>
          <Link to="/register">Register</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;