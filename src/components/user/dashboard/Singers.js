import React, {useContext, useEffect, useState}  from 'react'
import { db } from '../../../data/firebase';
import { getDocs, collection, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import classes from './Singer.module.css';

const Singers = () => {

    const [data, setData] = useState([]);

    useEffect(() => {

        const q = query(collection(db, "singers"), limit(10));
        getDocs(q).then(docs => {
            let singers = [];
            docs.forEach(doc => {
                singers = [...singers, {
                    id: doc.id,
                    title: doc.data().title,
                    img: doc.data().img,
                    count: doc.data().count
                }]
            })
            setData(singers);
        })

    }, [])

    return (
        <div className={classes.recent}>
            <h3>Singers</h3>
            <div className={classes.recent_first}>
                {data.map(song => (
                    <Link to={`/singers/${song.title}`} key={song.id}><div className={classes.recent_second}>
                        <img src={song.img} alt="Song" />
                        <h2>{song.title}</h2>
                    </div></Link>
                ))}
            </div>
        </div>
    );

}

export default Singers;