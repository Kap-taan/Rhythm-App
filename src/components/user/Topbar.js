import React from 'react';
import classes from './dashboard.module.css';

import { Link, useNavigate } from 'react-router-dom';


const Topbar = () => {

    

    const navigate = useNavigate();

    

    const backHandler = () => {

        navigate(-1);

    }

    const forwardHandler = () => {

        navigate(+1);

    }

    return (
        <div className={classes.dashboard_first}>
            <img src='/icon/arrow_left.svg' alt="Behind" className={classes.back} onClick={backHandler} />
            <img src='/icon/arrow_right.svg' alt="Forward" className={classes.back} onClick={forwardHandler} />
            <div className={classes.dashboard_first_first}>
                <button><Link to="/musicmode">Music Mode</Link></button>
            </div>
            
        </div>
    );

}

export default Topbar;