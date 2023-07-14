import Recent from './Recent';
import classes from './dashboard.module.css';
import Topbar from './Topbar';
import Album from './dashboard/Album';
import Singers from './dashboard/Singers';
import { useEffect, useState } from 'react';
import Ad from './Ad';
import RecentSong from './RecentSong';
import CustomPlaylist from './dashboard/CustomPlaylist';

const Dashboard = () => {

    const [visible, setVisible] = useState(false);

    useEffect(() => {

        // const addTimer = setInterval(() => {
        //     setVisible(true);
        // }, 1800000)

        // return () => clearInterval(addTimer);

    }, [])

    return (
        <div className={classes.dashboard}>
            {!visible && <Topbar />}
            {!visible && <Album />}
            {!visible && <Singers />}
            {!visible && <Recent type="Popular Songs" />}
            {!visible && <RecentSong type="New Releases" />}
            {!visible && <CustomPlaylist />}
            {visible && <Ad setVisible={setVisible} />}
        </div>
    );

}

export default Dashboard;