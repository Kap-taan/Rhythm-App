import { addDoc, collection, deleteDoc, doc, getDocs, query, updateDoc, where, arrayUnion, arrayRemove, setDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useKey } from 'rooks';
import { db } from '../../data/firebase';
import AuthContext from '../../stores/AuthContext';
import classes from './music.module.css';
import { useLocation } from 'react-router-dom';

const MusicContext = React.createContext({});

export const MusicPlayer = ({ children }) => {

    const [data, setData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isLikedButtonHidden, setIsLikedButtonHidden] = useState(false);

    const [nextData, setNextData] = useState([]);


    // User Data
    const { user } = useContext(AuthContext);

    // References
    const audioRef = useRef();
    const barRef = useRef();
    const progressBarRef = useRef();
    const volumeRef = useRef();
    const volumeBarRef = useRef();

    // States
    const [playing, setPlaying] = useState(false);
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

    // UseEffect
    useEffect(() => {
        barRef.current.style.width = '0%';
        if(data.type === undefined) {
            setIsLikedButtonHidden(true);
        } else {
            setIsLikedButtonHidden(false);
        }
        playHandler();

    }, [data]);

    useEffect(() => {
        // Check the local storage for volume
        if(localStorage.getItem('volume')) {
            const audio = audioRef.current;
            const volumeElement = volumeRef.current;
            const value = parseFloat(localStorage.getItem('volume'));
            audio.volume = value;
            volumeElement.style.width = Math.ceil(value * 100) + '%';
        }   
    }, [])

    // Playing the Song on Clicking play button
    const playHandler = () => {
        if(loading === false) {
            setLoading(true);
        }
        const audio = audioRef.current;
        setPlaying(true);
        audio.play();
    }

    // Playing the previous song
    const previousHandler = () => {
        barRef.current.style.width = '0%';
        const length = nextData.length - 1;
        const index = Math.floor((Math.random() * length));
        setData(nextData[index]);
    }

    // Pausing the Song on Clicking pause button
    const pauseHandler = () => {
        const audio = audioRef.current;
        setPlaying(false);
        audio.pause();
    }

    // Playing the next song
    const nextHandler = () => {
        barRef.current.style.width = '0%';
        const length = nextData.length - 1;
        const index = Math.floor((Math.random() * length));
        setData(nextData[index]);
    }

    // Changing the current timing of the song
    const clickHandler = (e) => {

        const fullWidth = progressBarRef.current.clientWidth;
        const width = e.clientX - progressBarRef.current.getBoundingClientRect().left;
        const audio = audioRef.current;
        const duration = audio.duration;
        audio.currentTime = (width / fullWidth) * duration;

    }

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

    // Changing the Level of Volume
    const changeVolumeHandler = (e) => {

        const fullWidth = volumeBarRef.current.clientWidth;
        const width = e.clientX - volumeBarRef.current.getBoundingClientRect().left;
        const audio = audioRef.current;

        const duration = 1;
        const volumeElement = volumeRef.current;
        const amount = (width / fullWidth) * duration;
        audio.volume = amount;
        console.log(amount);
        localStorage.setItem('volume', amount);
        volumeElement.style.width = Math.ceil(amount * 100) + '%';


    }

    // Add this song to the Favourites
    const favouriteHandler = async () => {
        console.log('I am here');
        const songRef = doc(db, "songs", data.id);
        data.isFavourite = true;
        await updateDoc(songRef, {
            favourites: arrayUnion(user.uid)
        });
        const collectionName = user.uid + '@' + 'liked'
        await setDoc(doc(db, collectionName, data.id), data);

    }

    // Removing the songs from the Favourites
    const NotFavouriteHandler = async () => {

        
        const songRef = doc(db, "songs", data.id);
        await updateDoc(songRef, {
            favourites: arrayRemove(user.uid)
        });
        data.isFavourite = false;
        const collectionName = user.uid + '@' + 'liked'
        deleteDoc(doc(db, collectionName, data.id));

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

    useKey(["m"], () => {
        if(!audioRef.current.volume) {
            audioRef.current.volume = 1;
            volumeRef.current.style.width = '100%';
            return;
        }
        audioRef.current.volume = 0;
        volumeRef.current.style.width = '0%';
    })

    const SetSong = (song) => {
        setData(song);
    }

    const nextSongs = (songs) => {
        setNextData(songs);
    }

    const value = {
        SetSong,
        nextSongs
    };


    return (
        <MusicContext.Provider value={value}>
            {children}
            <div className={classes.music}>
                <div className={classes.music_first}>
                    <div className={classes.music_first_first}>
                        {data.img && <img src={data.img} alt="Cover" />}
                        <audio src={data.link} ref={audioRef} onChange={playHandler} onTimeUpdate={updateProgressBar} />
                    </div>
                    <div className={classes.music_first_second}>
                        <h4>{data.title}</h4>
                        <h5>{data.singer}</h5>
                    </div>
                    {!isLikedButtonHidden && <div className={classes.music_first_third}>
                        {!data.isFavourite && <img src="/icon/heart.svg" alt="Heart" onClick={favouriteHandler} />}
                        {data.isFavourite && <img src="/icon/heart.png" alt="Heart" onClick={NotFavouriteHandler} />}
                    </div>}
                </div>
               <div className={classes.music_second}>
                    <div className={classes.music_second_first}>
                        <img src="/icon/music/back.svg" alt="Previous" onClick={previousHandler}  />
                        {!playing && <img src="/icon/music/play.svg" alt="Play" onClick={playHandler} />}
                        {playing && <img src="/icon/music/pause.svg" alt="Pause" onClick={pauseHandler} />}
                        <img src="/icon/music/next.svg" alt="Next" onClick={nextHandler} />
                    </div>
                    <div className={classes.music_second_second}>
                        <h5>{currentTiming}</h5>
                        <div className={classes.progress}ref={progressBarRef} onClick={clickHandler}>
                            <div className={classes.bar} ref={barRef}></div>
                        </div>
                        <h5>{songLen}</h5>
                    </div>
                </div>
                <div className={classes.music_third}>
                    <img src="/icon/music/volume.svg" alt="Volume" />
                    <div className={classes.progress} ref={volumeBarRef} onClick={changeVolumeHandler}>
                        <div className={classes.bar1} ref={volumeRef}></div>
                    </div>
                </div>
            </div>
        </MusicContext.Provider>
    );

}

export default MusicContext;