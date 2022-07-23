import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import AuthContext from '../stores/AuthContext.js';
import classes from './Login.module.css';

const Login = () => {

    const { login } = useContext(AuthContext);
    const [error, setError] = useState('');
    const navigation = useNavigate();

    const [loading, setLoading] = useState(false);

    const submitHandler = (e) => {

        setLoading(true);

        e.preventDefault();
        setError('');

        const email = e.target.email.value;
        const password = e.target.password.value;

        if(!email || !password)
        {
            setLoading(false);
            return setError('Some Field is empty');
        }

        login(email, password).then(user => {
            console.log("Logged In Successfully");
            navigation('/dashboard');
            setLoading(false);
        }).catch(err => {
            const error = err.message.split('/')[1].split(')')[0].split('-');
            let errorString = '';
            error.forEach(err => {
                errorString += err.toLocaleUpperCase();
                errorString += ' ';
            })
            console.log(errorString);
            setError(errorString);
            setLoading(false);
        })

    }

    return (
        <>
        <Navbar />
        <div className={classes.login}>
            <img src="/login/loginn.svg" alt="Icon" />
            <section className={classes.getintouch}>
                <h2>Login</h2>
                {error && <div style={{textAlign: "center"}}>{error}</div>}
                {loading && <div style={{textAlign: "center"}}>Loading...</div>}
                <form onSubmit={submitHandler}>
                    <label for="email">E-mail</label>
                    <input type="email" name="email" />
                    <label for="password">Password</label>
                    <input type="password" name="password" />
                    <input type="submit" value="Login" />
                </form>
                <p>Want a Account ? <Link to="/signup"><span>Signup</span></Link></p>
            </section>
        </div>
        </>
    );

}

export default Login;