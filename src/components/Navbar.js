import React from "react";
import { Link } from "react-router-dom";
import classes from "./navbar.module.css";

const Navbar = () => {
  return (
    <div className={classes.navbar}>
      <Link to="/">
        <div className={classes.navbar_first}>
          <h3>
            <span>Rhythm</span>App
          </h3>
        </div>
      </Link>
      <ul className={classes.navbar_second}>
        {/* <li><Link to="/">Home</Link></li>
                <li>About</li>
                <li>News</li>
                <li>Contact</li> */}
      </ul>
      <div className={classes.navbar_third}>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
