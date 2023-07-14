import { collection, doc, getDocs, query, updateDoc, limit, startAfter, increment } from "firebase/firestore";
import React, {useContext, useEffect, useRef, useState} from "react";
import { db } from "../../data/firebase";
import AuthContext from "../../stores/AuthContext";
import MusicContext from "./Music";
import classes from './Search.module.css';
import Topbar from './Topbar';

const Search = () => {


    const { SetSong, nextSongs } = useContext(MusicContext);
    const [data, setData] = useState([]);
    const [allData, setAllData] = useState([]);

    const [isFetching, setIsFetching] = useState(false);

    const [limited, setLimited] = useState(10);
    const [lastVisible, setLastVisible] = useState(null);

    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    const containerRef = useRef();

    const getSongs = async () => {
        const data = await getDocs(query(collection(db, "songs"), limit(limited)));
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
        setLastVisible(data.docs[data.docs.length-1]);
        console.log(tempSongs);
        setAllData(tempSongs);
        setData(tempSongs);
        setLoading(false);
    }

    const getMoreSongs = async () => {
        setLoading(true);
        const data1 = await getDocs(query(collection(db, "songs"), startAfter(lastVisible), limit(limited)));
        let tempSongs = [];
        if (data1.empty) {
            if(containerRef.current !== undefined)
                containerRef.current.removeEventListener('scroll', handleScroll);
            setLoading(false);
            setIsFetching(false);
            return;
          }
        data1.forEach(doc => {
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
        setLastVisible(data1.docs[data1.docs.length-1]);
        console.log([...allData, ...tempSongs]);
        setAllData([...allData, ...tempSongs]);
        setData([...data, ...tempSongs]);
        setLoading(false);
        setIsFetching(false);
    }

    useEffect(() => {
        if(containerRef.current !== undefined)
            containerRef.current.addEventListener('scroll', handleScroll);
        return () => {
            // if(containerRef.current !== undefined)
                // containerRef.current.removeEventListener('scroll', handleScroll);
        };
    }, [containerRef.current])

    useEffect(() => {
        if(user) getSongs();
    }, [user])

    useEffect(() => {
        if(isFetching) {
            getMoreSongs();
        }
    }, [isFetching])

    const handleScroll = () => {
        const { scrollTop, offsetHeight, scrollHeight } = containerRef.current;
        // 4060 790 4835
        let triggerHeight = scrollTop + offsetHeight;
        if ((triggerHeight >= scrollHeight) && !isFetching) {
            setIsFetching(true);
          }
    }    

    const clickHandler = async (song) => {
        const songDoc = doc(db, "songs", song.id);
        await updateDoc(songDoc, {
            count: increment(1)
        });
        SetSong(song);
        nextSongs(data);
        
    }

    const changeHandler = (e) => {
        const searchItem = e.target.value;
        console.log(searchItem);
        const newData = allData.filter(song => song.title.toLowerCase().includes(searchItem.toLowerCase()));
        setData(newData);
    }

    return (
        <div className={classes.search} ref={containerRef}>
            <Topbar />
            <div className={classes.search_bar_div}>
                <input type="" name="search" className={classes.search_bar} placeholder="Search Your Favourite Songs" onChange={changeHandler} />
            </div>
            <div className={classes.recent_first} >
                {data.map(song => (
                    <div key={song.id} className={classes.recent_second} onClick={() => {
                        clickHandler(song)
                    }}>
                        <img src={song.img} alt="Song" />
                        <h2>{song.title}</h2>
                        <h4>{song.singer}</h4>
                    </div>  
                ))}
            </div>
            {loading && <div><h3 className={classes.loading}>Loading...</h3></div>}
        </div>
    );

}

export default Search;