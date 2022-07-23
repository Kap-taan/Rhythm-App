import React, {useContext, useEffect, useState} from "react";
import MusicContext from "./Music";
import { db } from '../../data/firebase';
import AuthContext from "../../stores/AuthContext";
import { getDocs, collection, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";
import classes from './recent.module.css'

const Recent = ({ type }) => {

    const { SetSong, nextSongs } = useContext(MusicContext);
    const [data, setData] = useState([]);

    const { user } = useContext(AuthContext);

    useEffect(() => {

        const q = query(collection(db, "songs"), orderBy("count", "desc"), limit(10));
        getDocs(q).then(docs => {
            let songs = [];

            docs.forEach(doc => {

                let favourites;
                let isFavourite;
                if(doc.data().favourites === undefined) {
                    favourites = [];
                } else {
                    favourites = doc.data().favourites;
                }
                console.log(favourites.filter(favourite => favourite === user.uid)[0]);
                if(favourites.filter(favourite => favourite === user.uid)[0] !== undefined) {
                    isFavourite = true;
                } else {
                    isFavourite = false;
                }

                songs = [...songs, {
                    title: doc.data().title,
                    singer: doc.data().singer,
                    img: doc.data().img,
                    link: doc.data().link,
                    count: doc.data().count,
                    id: doc.id,
                    favourites: favourites,
                    isFavourite: isFavourite
                }]
            })
            setData(songs);
        })

    }, [])

    const clickHandler = (song) => {
        const songDoc = doc(db, "songs", song.id);
        updateDoc(songDoc, {
            count: song.count + 1
        }).then(() => {
            SetSong(song);
            nextSongs(data);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div className={classes.recent}>
            <h3>{type}</h3>
            <div className={classes.recent_first}>
                {data.map(song => (
                    <div className={classes.recent_second} onClick={() => {
                        clickHandler(song)
                    }}>
                        <img src={song.img} alt="Song" />
                        <h2>{song.title}</h2>
                        <h4>{song.singer}</h4>
                    </div>  
                ))}
            </div>
        </div>
    );

}

export default Recent;