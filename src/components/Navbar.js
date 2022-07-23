import React from "react";
import { Link } from "react-router-dom";
import classes from './navbar.module.css';

const Navbar = () => {

    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_first}>
                <h3><span>Rhythm</span>App</h3>
            </div>
            <ul className={classes.navbar_second}>
                <li><Link to="/">Home</Link></li>
                <li>About</li>
                <li>News</li>
                <li>Contact</li>
            </ul>
            <div className={classes.navbar_third}>
                <button><Link to="/login">Login/Signup</Link></button>
            </div>
        </div>
    );

}

export default Navbar;