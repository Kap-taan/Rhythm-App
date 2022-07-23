import React, { useContext, useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../../data/firebase';
import AuthContext from '../../stores/AuthContext';
import { Link } from 'react-router-dom';
import classes from './Playlists.module.css';
import Topbar from './Topbar';

const Playlists = () => {

    const { user } = useContext(AuthContext);
    const [playlists, setPlaylists] = useState([]);

    useEffect(() => {

        const userUid = user.uid;
        console.log(user.uid);
        const q = query(collection(db, "playlists"), where("userUid", "==", userUid), orderBy("created_at", "desc"))
        getDocs(q).then(docs => {
            let playlist = [];
            docs.forEach(doc => {
                playlist = [...playlist, {
                    playlistName: doc.data().playlistName,
                    collectionName: doc.data().playlistColl,
                    playlistCover: doc.data().playlistCover
                }];
            })
            console.log(playlist);
            setPlaylists(playlist);
        })

    }, [])

    return (
        <div className={classes.playlists}>
            <Topbar />
            <h3>My Playlists</h3>
            <div className={classes.songs_grid}>
                <div className={classes.recent_first}>
                    {playlists.map(playlist => (
                        <Link to={`/playlist/${playlist.collectionName}`}><div className={classes.recent_second}>
                            <img src={playlist.playlistCover} alt="Song" />
                            <h2>{playlist.playlistName}</h2>
                            {/* <h4>{playlist.singer}</h4> */}
                        </div></Link>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default Playlists;