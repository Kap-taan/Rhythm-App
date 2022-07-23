import React, { useContext, useState } from 'react';
import Navbar from "../components/Navbar";
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../stores/AuthContext';
import { db } from '../data/firebase';
import { collection, addDoc } from "firebase/firestore"; 
import classes from './Login.module.css';

const Signup = () => {


    const { signup } = useContext(AuthContext);
    const [error, setError] = useState('');
    const navigation = useNavigate();
    const [loading, setLoading] = useState(false);

    const submitHandler = (e) => {

        setLoading(true);

        e.preventDefault();
        setError('');

        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const confirmPassword = e.target.confirmPassword.value;

        console.log(name, email, password, confirmPassword);

        if(!name || !email || !password || !confirmPassword)
        {
            setLoading(false);
            return setError('Some field is empty');
        }

        if(password !== confirmPassword)
        {
            setLoading(false);
            return setError('Passwords do not match');
        }

        if (password === confirmPassword) {
            signup(email, password)
                .then(user => {
                    const uid = user.user.uid
                    return addDoc(collection(db, "users"), {
                            email: email,
                            name: name,
                            userUid: uid,
                            playlists: [],
                            likedSongs: []
                        })
                })
                .then(() => {
                    navigation('/dashboard');
                    setLoading(false);
                })
                .catch(err => {
                    const error = err.message.split('/')[1].split(')')[0].split('-');
                    let errorString = '';
                    error.forEach(err => {
                        errorString += err.toLocaleUpperCase();
                        errorString += ' ';
                    })
                    console.log(errorString);
                    setError(errorString);
                    setLoading(false);
                });
        }

    }

    return (
        <>
        <Navbar />
        <div className={classes.login}>
            <img src="/login/signup1.svg" alt="Icon" />
            <section className={classes.getintouch}>
                <h2>Sign Up</h2>
                {error && <div style={{textAlign: "center"}}>{error}</div>}
                {loading && <div style={{textAlign: "center"}}>Loading...</div>}
                <form onSubmit={submitHandler}>
                    <label for="name">Name</label>
                    <input type="text" name="name" />
                    <label for="email">E-mail</label>
                    <input type="email" name="email" />
                    <label for="password">Password</label>
                    <input type="password" name="password" />
                    <label for="password">Confirm Password</label>
                    <input type="password" name="confirmPassword" />
                    <input type="submit" value="Signup" />
                </form>
                <p>Already Signup ? <Link to="/login"><span>Login</span></Link></p>
            </section>
        </div>
        </>
    );

}

export default Signup;