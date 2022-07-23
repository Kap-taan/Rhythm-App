import { addDoc, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../../data/firebase';
import AuthContext from '../../stores/AuthContext';
import classes from './Add.module.css';
import Topbar from './Topbar';

const Add = () => {

    const [loading, setLoading] = useState(false);
    const { id } = useParams();

    const { user } = useContext(AuthContext);
    const [allData, setAllData] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {

        getDocs(collection(db, "songs")).then(docs => {
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


    const changeHandler = (e) => {
        const searchItem = e.target.value;
        console.log(searchItem);
        const newData = allData.filter(song => song.title.toLowerCase().includes(searchItem.toLowerCase()));
        setData(newData);
    }

    const clickHandler = (song) => {
        console.log(song);
        setLoading(true);
        addDoc(collection(db, id), song).then(() => {
            setAllData(allData.filter(doc => doc.title === song.title))
            setLoading(false);
            alert('Song Added Successfully');
        })
    }

    return (
        <div className={classes.add}>
            <Topbar />
            <h1>Add Your Favourite Songs</h1>
            <div className={classes.search_bar_div}>
                <input type="" name="search" className={classes.search_bar} placeholder="Search Your Favourite Songs" onChange={changeHandler} />
            </div>
            {!loading && <div className={classes.songs_grid}>
            <div className={classes.recent_first}>
                {data.map(song => (
                    <div className={classes.recent_second}>
                        <img src={song.img} alt="Song" />
                        <h2>{song.title}</h2>
                        <h4>{song.singer}</h4>
                        <button className={classes.btn} onClick={() => {
                            clickHandler(song)
                        }}>Add</button>
                    </div>  
                ))}
            </div>
            </div>}
            {loading && <div><h3 style={{textAlign: "center"}}>Adding the Song</h3></div>}
        </div>
    );

}

export default Add;