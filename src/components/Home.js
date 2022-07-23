import React, { useRef, useState, useEffect } from 'react'
import icon from './img/bac.svg';
import { Link } from 'react-router-dom';
import classes from './Home.module.css'
import Navbar from './Navbar.js';

const Home = () => {

    return (
        <div className={classes.home}>
            <Navbar />
            <div className={classes.home_second}>
                <div className={classes.second}>
                    <img src={icon} alt="Icon" />
                </div>
                <div className={classes.first}>
                    <h1><span>Listen</span> to  new music</h1>
                    <h4>
                        Millions of songs and podcasts. No credit card needed.
                    </h4>
                    <div className={classes.btn}>
                    <Link to="/signup"><button>Signup</button></Link>
                    </div>
                </div>
                
            </div>
        </div>
    );

}

export default Home;