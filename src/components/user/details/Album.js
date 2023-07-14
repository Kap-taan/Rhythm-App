import { collection, doc, getDocs, query, updateDoc } from "firebase/firestore";
import React, {useContext, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../data/firebase";
import MusicContext from "../Music";
import classes from './Album.module.css';
import Topbar from '../Topbar';

const Album1 = () => {

    const { SetSong, nextSongs } = useContext(MusicContext);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);

    const [loading, setLoading] = useState(true);

    const { id } = useParams();

    useEffect(() => {

        getDocs(collection(db, id)).then(docs => {
            let song = [];
            docs.forEach(doc => {
                
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
                    feature: doc.data().feature
                }]

            })
            setAllData(song);
            setData(song);
            setLoading(false);
        })

    }, [])

    

    const clickHandler = (song) => {
        const songDoc = doc(db, id, song.id);
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
            
            {/* <div className={classes.search_bar_div}>
                <input type="" name="search" className={classes.search_bar} placeholder="Search Your Song" onChange={changeHandler} />
            </div> */}
            <h2>{id}</h2>
            {loading && <div><h3 className={classes.loading}>Loading...</h3></div>}
            {!loading && <div className={classes.songs_grid}>
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
            </div>}
        </div>
    );

}

export default Album1;