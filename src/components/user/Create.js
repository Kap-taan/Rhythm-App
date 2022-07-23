import { addDoc, collection } from 'firebase/firestore';
import React, { useState, useContext } from 'react';
import { db } from '../../data/firebase';
import AuthContext from '../../stores/AuthContext';
import classes from './Create.module.css';
import Topbar from './Topbar';

const Create = () => {

    const [loading, setLoading] = useState(false);
    const { user } = useContext(AuthContext);

    const submitHandler = (e) => {

        e.preventDefault();

        setLoading(true);
        const collectionName = user.uid + '@' + e.target.name.value;
        addDoc(collection(db, collectionName), {
            title: '',
            songer: '',
            img: '',
            link: ''
        }).then(() => {
            return addDoc(collection(db, "playlists"), {
                playlistColl: collectionName,
                playlistCover: e.target.url.value,
                playlistName: e.target.name.value,
                userUid: user.uid,
                created_at: new Date()
            })
        })
        .then(() => {
            setLoading(false);
            e.target.reset();
            alert('New Playlist Created Successfully');
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
        })
    }

    return (
        <div className={classes.create}>
            <Topbar />
            <section className={classes.getintouch}>
                <h2>Create a New Playlist</h2>
                {loading && <div style={{textAlign: "center"}}>Loading...</div>}
                <form onSubmit={submitHandler}>
                    <label for="name">Name</label>
                    <input type="text" name="name" />
                    <label for="url">Image URL</label>
                    <input type="text" name="url" />
                    <input type="submit" value="Create" />
                </form>
            </section>
        </div>
    );

}

export default Create;