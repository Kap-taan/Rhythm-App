import React, {useContext, useEffect, useState} from "react";
import { db } from '../../../data/firebase';
import { getDocs, collection, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import classes from './Album.module.css'

const Album = () => {

    const [data, setData] = useState([]);

    useEffect(() => {

        const q = query(collection(db, "albums"), limit(10));
        getDocs(q).then(docs => {
            let albums = [];
            docs.forEach(doc => {
                albums = [...albums, {
                    title: doc.data().title,
                    img: doc.data().img,
                    singer: doc.data().singer,
                    count: doc.data().count
                }]
            })
            setData(albums);
        })

    }, [])


    return (
        <div className={classes.recent}>
            <h3>Albums</h3>
            <div className={classes.recent_first}>
                {data.map(song => (
                    <Link to={`/album/${song.title}`}><div className={classes.recent_second}>
                        <img src={song.img} alt="Song" />
                        <h2>{song.title}</h2>
                        <h4>{song.singer}</h4>
                    </div></Link>
                ))}
            </div>
        </div>
    );

}

export default Album;