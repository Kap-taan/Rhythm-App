import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import { db } from "../../data/firebase";
import AuthContext from "../../stores/AuthContext";
import MusicContext from "./Music";
import classes from './Search.module.css';
import Topbar from './Topbar';

const Liked = () => {

    const { SetSong, nextSongs } = useContext(MusicContext);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const collectionName = user.uid + '@' + 'liked';
        console.log(collectionName);
        getDocs(collection(db, collectionName)).then(docs => {
            let song = [];
            let isFavourite;
            docs.forEach(doc => {

                let favourites;
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
                
                song = [...song, {
                    id: doc.id,
                    title: doc.data().title,
                    singer: doc.data().singer,
                    lyrics: doc.data().lyrics,
                    music: doc.data().music,
                    img: doc.data().img,
                    link: doc.data().link,
                    count: doc.data().count,
                    released_date: doc.data().released_date,
                    feature: doc.data().feature,
                    favourites: favourites,
                    isFavourite: isFavourite
                }]

            })
            setAllData(song);
            setData(song);
            setLoading(false);
        })

    }, [])

    

    const clickHandler = (song) => {
        console.log(song);
        const songDoc = doc(db, `${user.uid}@liked`, song.id);
        updateDoc(songDoc, {
            count: song.count + 1
        }).then(() => {
            SetSong(song);
            nextSongs(data);
        }).catch(err => {
            console.log(err);
        })
        
    }

    const changeHandler = (e) => {
        const searchItem = e.target.value;
        console.log(searchItem);
        const newData = allData.filter(song => song.title.toLowerCase().includes(searchItem.toLowerCase()));
        setData(newData);
    }

    return (
        <div className={classes.search}>
            <Topbar />
            <div className={classes.search_bar_div}>
                <input type="" name="search" className={classes.search_bar} placeholder="Search Your Favourite Songs" onChange={changeHandler} />
            </div>
            {loading && <div><h3 className={classes.loading}>Loading...</h3></div>}
            {!loading && <div className={classes.songs_grid}>
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
            </div>}
        </div>
    );

}

export default Liked;