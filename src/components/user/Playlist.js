import { collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../data/firebase';
import MusicContext from './Music';
import { Link } from 'react-router-dom';
import classes from './Playlist.module.css'
import Topbar from './Topbar';

const Playlist = () => {

    const { id } = useParams();

    const navigate = useNavigate();


    const playlistName = id.split('@')[1];

    const [songs, setSongs] = useState([]);

    const { SetSong, nextSongs } = useContext(MusicContext);

    useEffect(() => {

        getDocs(collection(db, id)).then(docs => {
            let songs = [];
            docs.forEach(doc => {
                if(doc.data().title !== '') {
                    songs = [...songs, {
                        title: doc.data().title,
                        singer: doc.data().singer,
                        img: doc.data().img,
                        link: doc.data().link,
                    }]
                }
            })
            setSongs(songs);
        })

    })

    const deleteHandler = () => {
        // We have the id i.e name of the collection to be deleted
        // We have the playlist name which have to find in the playlists collection and delete that document

        getDocs(collection(db, id)).then(docs => {
            docs.forEach(docc => {
                deleteDoc(doc(db, id, docc.id)).then(() => {
                    console.log('Deleted Successfully');
                   
                }).catch(err => {
                    console.log(err);
                })
            })
            getDocs(query(collection(db, "playlists"), where("playlistName", "==", playlistName))).then(docs => {
                docs.forEach(docc => {
                    deleteDoc(doc(db, "playlists", docc.id)).then(() => {
                        console.log('All Deleted Successfully');
                        navigate(-1);
                    }).catch(err => {
                        console.log(err);
                    })
                })
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })

    }

    const clickHandler = (song) => {
        console.log(song);
        SetSong(song);
        nextSongs(songs);
    }

    return (
        <div className={classes.playlist}>
            <Topbar />
            <h3>{playlistName}</h3>
            <div className={classes.songs_grid}>
                <div className={classes.recent_first}>
                    {songs.map(song => (
                          <div className={classes.recent_second} onClick={() => {
                            clickHandler(song)
                        }}>
                            <img src={song.img} alt="Song" />
                            <h2>{song.title}</h2>
                            <h4>{song.singer}</h4>
                        </div>
                    ))}
                </div>
                <Link to={`/add/${id}`}>
                    <div className={classes.add_songs}>
                        <img src="/icon/plus.svg" alt="Add" />
                    </div>
                </Link>
                <div className={classes.delete} onClick={deleteHandler}>
                <img src="/icon/trash.svg" alt="Trash" />
                </div>
            </div>
            
        </div>
    );

}

export default Playlist