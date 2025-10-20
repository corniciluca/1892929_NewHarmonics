import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Dashboard from './routes/Dashboard';
import Upload from './routes/Upload';
import MySongs from './routes/MySongs';
import Following from './routes/Following';
import Profile from './routes/Profile';
import UserProfile from './routes/UserProfile';
import NotFound from './routes/NotFound';
import Notification from './routes/Notification';
import SongsManagement from './routes/SongsManagement';
import SongEdit from './routes/SongEdit';
import EditProfile from './routes/EditProfile';
import Test from './routes/test.js';
import Testuser from './routes/testuser.js';

// Demo stato autenticazione
function App() {
  // Puoi collegare user, isArtist e isLoggedIn al tuo auth provider
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isArtist, setIsArtist] = useState(false);

  

  function handleLogin(isArtistFlag) {
    setIsLoggedIn(true);
    setIsArtist(isArtistFlag);
  }
  function handleLogout() {
    setIsLoggedIn(false);
    setIsArtist(false);
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} isArtist={isArtist} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/upload" element={isLoggedIn && isArtist ? <Upload /> : <Navigate to="/login" />} />
        <Route path="/mysongs" element={isLoggedIn && isArtist ? <MySongs /> : <Navigate to="/login" />} />
        <Route path="/following" element={isLoggedIn ? <Following /> : <Navigate to="/login" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/notification" element={isLoggedIn ? <Notification /> : <Navigate to="/login" />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/manage-songs" element={isLoggedIn ? <SongsManagement /> : <Navigate to="/login" />} />
        <Route path="/edit-song/:id" element={isLoggedIn ? <SongEdit /> : <Navigate to="/login" />} />
        <Route path="/edit-profile" element={isLoggedIn ? <EditProfile /> : <Navigate to="/login" />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/test" element={<Test />} />
        <Route path="/testuser" element={<Testuser />} />
      </Routes>
    </Router>
  );
}

export default App;
