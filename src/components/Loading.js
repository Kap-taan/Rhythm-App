import React from "react";
import classes from './Loading.module.css';

const Loading = () => {
    return (
        <div className={classes.loading}>
            <img src="/icon/equalizer.svg" alt="Main Logo" />
            <h2>Rhythm App</h2>
        </div>
    );
}

export default Loading;