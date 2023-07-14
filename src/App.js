import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import Home from "./components/Home";
import Music from "./components/Music";
import Dashboard from "./components/user/Dashboard";
import { MusicPlayer } from "./components/user/Music";
import Navbar from "./components/user/Navbar";
import { AuthProvider } from "./stores/AuthContext";
import { getAuth } from 'firebase/auth';
import RequireAuth from "./routes/PrivateRoute";
import PublicAuth from "./routes/PublicRoute";
import app from "./data/firebase";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Search from "./components/user/Search";
import Create from "./components/user/Create";
import Playlists from "./components/user/Playlists";
import Playlist from "./components/user/Playlist";
import Add from "./components/user/Add";
import Album1 from "./components/user/details/Album";
import Singer from "./components/user/details/Singer";
import Topbar from "./components/user/Topbar";
import Liked from "./components/user/Liked";
import CustomDetail from "./components/user/details/CustomDetail";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <div className="App">
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> */}
          <Route
              path="/"
              element={
                <PublicAuth>
                  <Home />
                </PublicAuth>
              }
            />
          <Route
              path="/login"
              element={
                <PublicAuth>
                  <Login />
                </PublicAuth>
              }
            />
          <Route
              path="/signup"
              element={
                <PublicAuth>
                  <Signup />
                </PublicAuth>
              }
            />
          <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Dashboard /></div></MusicPlayer>
                </RequireAuth>
              }
            />
          <Route
              path="/search"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Search /></div></MusicPlayer>
                </RequireAuth>
              }
            />
          <Route
              path="/create"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Create /></div></MusicPlayer>
                </RequireAuth>
              }
            />
          <Route
              path="/playlists"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Playlists /></div></MusicPlayer>
                </RequireAuth>
              }
            />
          <Route
              path="/playlist/:id"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Playlist /></div></MusicPlayer>
                </RequireAuth>
              }
            />
            <Route
              path="/add/:id"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Add /></div></MusicPlayer>
                </RequireAuth>
              }
            />
            <Route
              path="/musicmode"
              element={
                <RequireAuth>
                  <div className="App_first"><Music /></div>
                </RequireAuth>
              }
            />
            <Route
              path="/album/:id"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Album1 /></div></MusicPlayer>
                </RequireAuth>
              }
            />
            <Route
              path="/singers/:id"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Singer /></div></MusicPlayer>
                </RequireAuth>
              }
            />
            <Route
              path="/custom/:id"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><CustomDetail /></div></MusicPlayer>
                </RequireAuth>
              }
            />
            <Route
              path="/likedsongs"
              element={
                <RequireAuth>
                  <MusicPlayer><div className="App_first"><Navbar /><Liked /></div></MusicPlayer>
                </RequireAuth>
              }
            />
        </Routes>
      </div>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
