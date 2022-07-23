import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../../stores/AuthContext';
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from '../../data/firebase';
import classes from './navbar.module.css'

const Navbar = () => {

    const { logout, user } = useContext(AuthContext);
    const [currentUser, setCurrentUser] = useState({});

    const logoutHandler = () => {
        logout().then(() => {
            console.log('Logout Successful');
        }).catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {

        const userUid = user.uid;
        const q = query(collection(db, "users"), where("userUid", "==", userUid));
        getDocs(q).then(users => {
            let userr = [];
            users.forEach(user => {
                userr = [...userr, {
                    name: user.data().name
                }]
            });
            setCurrentUser(userr[0]);

        })

    }, [])



    return (
        <div className={classes.navbar}>
            <div className={classes.navbar_first_part}>
                <img src="/icon/equalizer.svg" alt="Icon" />
                <h2>Rhythm</h2>
            </div>
            <div className={classes.navbar_second_part}>
                <div className={classes.navbar_second_div}>
                    <Link to="/dashboard"><img src="/icon/house.svg" alt="Home" /></Link>
                    <Link to="/dashboard"><h3 className={classes.special}>Home</h3></Link>
                </div>
                <div className={classes.navbar_second_div}>
                    <Link to="/search"><img src="/icon/magnifying-glass.svg" alt="Search" /></Link>
                    <Link to="/search"><h3>Search</h3></Link>
                </div>
                <div className={classes.navbar_second_div}>
                    <Link to="/playlists"><img src="/icon/book.svg" alt="Playlists" /></Link>
                    <Link to="/playlists"><h3>Playlists</h3></Link>
                </div>
            </div>
            <div className={classes.navbar_third_part}>
                <div className={classes.navbar_second_div}>
                <Link to="/create"><img src="/icon/list-plus.svg" alt="Create" /></Link>
                    <Link to="/create"><h3>Create</h3></Link>
                </div>
                <div className={classes.navbar_second_div}>
                    <Link to="/likedsongs"><img src="/icon/heart.svg" alt="Liked" /></Link>
                    <Link to="/likedsongs"><h3>Liked Songs</h3></Link>
                </div>
            </div>
            <div className={classes.navbar_first_part}  onClick={logoutHandler}>
                <img src='/icon/user.svg' alt="User" />
                {currentUser && <h2>{currentUser.name}</h2>}
            </div>
        </div>
    );

}

export default Navbar;