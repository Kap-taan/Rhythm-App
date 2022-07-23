import React, { useEffect, useRef } from 'react';
import classes from './Ad.module.css';

const Ad = ({ setVisible }) => {

    useEffect(() => {

        const addTimer = setTimeout(() => {
            setVisible(false);
        }, 5000);

        return () => clearInterval(addTimer);

    }, [])

    return (
        <div className={classes.ad}>
            <video src="/media/ad.mp4" autoPlay muted   />
        </div>
    );

}

export default Ad;