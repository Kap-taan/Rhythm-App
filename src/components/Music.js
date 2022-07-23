import React, { useEffect, useRef, useState } from 'react'
import { useKey } from 'rooks';
import classes from './Music.module.css'
import { db } from '../data/firebase';
import { getDocs, collection, query, orderBy, limit, doc, updateDoc } from "firebase/firestore";

const Music = () => {


    // Data
    const [data, setData] = useState([]);

    useEffect(() => {

        const q = query(collection(db, "songs"), orderBy("count", "desc"), limit(10));
        getDocs(q).then(docs => {
            let songs = [];
            docs.forEach(doc => {
                songs = [...songs, {
                    title: doc.data().title,
                    singer: doc.data().singer,
                    img: doc.data().img,
                    link: doc.data().link,
                    count: doc.data().count,
                    id: doc.id
                }]
            })
            setData(songs);
        })

    }, [])

    // References
    const audioRef = useRef();
    const barRef = useRef();
    const progressBarRef = useRef();

    // States
    const [playing, setPlaying] = useState(false);
    const [count, setCount] = useState(0);
    const [currentTiming, setCurrentTiming] = useState('');
    const [songLen, setSongLen] = useState('');

    // Helper Functions
    const initialTiming = (seconds) => {
        var sec_num = parseInt(seconds, 10); // don't forget the second param
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        if (seconds < 10) { seconds = "0" + seconds; }
        return minutes + ':' + seconds;
    }

    // Playing the Song on Clicking play button
    const playHandler = () => {
        const audio = audioRef.current;
        setPlaying(true);
        audio.play();
    }

    // Pausing the Song on Clicking pause button
    const pauseHandler = () => {
        const audio = audioRef.current;
        setPlaying(false);
        audio.pause();
    }

    // Playing the next song
    const nextHandler = () => {

        const length = data.length - 1;
        if (count >= length) {
            setCount(0);
            return;
        }
        const temp = count + 1;
        setCount(temp);
    }

    // Playing the previous song
    const previousHandler = () => {

        const length = data.length - 1;
        if (count <= 0) {
            setCount(length);
            return;
        }
        const temp = count - 1;
        setCount(temp);
    }

    // Changing the current timing of the song
    const clickHandler = (e) => {

        const fullWidth = progressBarRef.current.clientWidth;
        const width = e.clientX - progressBarRef.current.getBoundingClientRect().left;
        const audio = audioRef.current;
        const duration = audio.duration;
        audio.currentTime = (width / fullWidth) * duration;

    }

    // On changing count playing the song again
    useEffect(() => {
        if (playing === true) {
            barRef.current.style.width = '0%';
            const audio = audioRef.current;
            audio.play();
        } else {
            barRef.current.style.width = '0%';
        }
    }, [count])

    // Updating the Progress Bar
    const updateProgressBar = (e) => {

        const currentTime = e.target.currentTime;
        const duration = e.target.duration

        const timing = initialTiming(Math.floor(currentTime));
        setCurrentTiming(timing);
        const songLength = initialTiming(Math.floor(duration));
        setSongLen(songLength);
        const progressLength = (currentTime / duration) * 100;

        if (progressLength === 100) {
            nextHandler();
        }

        barRef.current.style.width = progressLength + '%';

    }

    // Handling the key event
    useKey(["Space"], () => {
        if (playing) {
            barRef.current.style.width = '0%';
            pauseHandler();
        } else {
            playHandler();
        }
    });

    return (
        <div className={classes.music}>
            <div className={classes.card}>
                {data.length > 0 && <img src={data[count].img} alt="Song_image" />}
                {data.length > 0 && <audio src={data[count].link} ref={audioRef} onChange={playHandler} onTimeUpdate={updateProgressBar} />}
                <div className={classes.progress_bar} ref={progressBarRef} onClick={clickHandler}>
                    <div className={classes.bar} ref={barRef}></div>
                </div>
                <div className={classes.timing}>
                    <div>{currentTiming}</div>
                    <div>{songLen}</div>
                </div>
                {data.length > 0 && <h3>{data[count].title}</h3>}
                {data.length > 0 && <h4>{data[count].singer}</h4>}
                <div className={classes.icons}>
                    <img src="icon/back.svg" alt="previous" onClick={previousHandler} className={classes.icon} />
                    {!playing && <img src="icon/play.svg" alt="play" onClick={playHandler} className={classes.icon} />}
                    {playing && <img src="icon/pause.svg" alt="pause" onClick={pauseHandler} className={classes.icon} />}
                    <img src="icon/next.svg" alt="next" onClick={nextHandler} className={classes.icon} />
                </div>
            </div>
        </div>
    )

}

export default Music;