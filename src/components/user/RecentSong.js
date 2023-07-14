import React, {useContext, useEffect, useState} from "react";
import MusicContext from "./Music";
import { db } from '../../data/firebase';
import AuthContext from "../../stores/AuthContext";
import { getDocs, collection, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";
import classes from './recent.module.css'

const RecentSong = ({ type }) => {

    const { SetSong, nextSongs } = useContext(MusicContext);
    const [data, setData] = useState([]);

    const { user } = useContext(AuthContext);

    const getSongs = async () => {

        const data = await getDocs(query(collection(db, "songs"), orderBy("released_date", "desc"), limit(10)));
        let tempSongs = [];
        data.forEach(doc => {
            let favourites = doc.data().favourites;
            if(favourites === undefined) {
                favourites = [];
            }
            let isFavourite = false;
            if (favourites.includes(user.uid)) {
                isFavourite = true;
            }
            tempSongs = [...tempSongs, {
                id: doc.id,
                ...doc.data(),
                isFavourite
            }]
        });

        setData(tempSongs);
    }

    useEffect(() => {

        if(user) getSongs();

    }, [user])

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
                    <div className={classes.recent_second} key={song.id} onClick={() => {
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

export default RecentSong;