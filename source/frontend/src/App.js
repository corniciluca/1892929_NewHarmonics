import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { PlayerProvider } from './components/PlayerContext';
import SongPlayer from './components/SongPlayer';
import SongDetailModal from './components/SongDetailModal';
import Home from './routes/Home';
import Login from './routes/Login';
import Register from './routes/Register';
import Profile from './routes/Profile';
import UserProfile from './routes/UserProfile';
import EditProfile from './routes/EditProfile';

import Upload from './routes/Upload';
import NotFound from './routes/NotFound';

import SongsManagement from './routes/SongsManagement';
import Following from './routes/Following';
import Notification from './routes/Notification';
import SearchResults from './routes/SearchResults';

import SongEdit from './routes/SongEdit';

import Feed from './routes/Feed';

import LikedSongs from './routes/LikedSongs';

import { checkLoginStatus, logout } from './api/api';
import { getUserById } from './api/userApi';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAndSetUser = () => {
    setIsLoading(true);
    checkLoginStatus()
      .then(validationResponse => {
        const isValidId = validationResponse.userId !== null &&
                                  validationResponse.userId !== undefined &&
                                  validationResponse.userId !== "undefined" &&
                                  !isNaN(parseInt(validationResponse.userId))
        if (validationResponse.valid && isValidId) { 
          return getUserById(validationResponse.userId);
        } else {
          throw new Error("Sessione non valida o scaduta.");
        }
      })
      .then(user => {
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
      .catch(() => {
        setCurrentUser(null);
        localStorage.clear();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchAndSetUser();
  }, []);

  const handleLoginSuccess = () => {
    fetchAndSetUser();
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const isLoggedIn = !!currentUser;
  const isArtist = currentUser?.role === 'ARTIST';

  return (
    <PlayerProvider currentUser={currentUser}>
      <Router>
        <Navbar currentUser={currentUser} isLoggedIn={isLoggedIn} onLogout={handleLogout} isArtist={isArtist} />
        <Routes>
          
        <Route path="/" element={<Home currentUser={currentUser} />} />
        <Route 
          path="/login" 
          element={!isLoggedIn ? <Login onLogin={handleLoginSuccess} /> : <Navigate to="/profile" />} 
        />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/profile" />} />
        <Route
          path="/profile"
          element={isLoggedIn ? <Navigate to={`/user/${currentUser.id}`} /> : <Navigate to="/login" />}
        />
        <Route path="/user/:id" element={isLoggedIn ? <UserProfile currentUser={currentUser}/> : <Navigate to="/login" />} />
        <Route 
          path="/edit-profile" 
          element={isLoggedIn ? <EditProfile user={currentUser} onUserUpdate={handleUserUpdate} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/upload" 
          element={isLoggedIn && isArtist ? <Upload currentUser={currentUser} /> : <Navigate to="/" />} 
        />
        
        <Route path="/search" element={<SearchResults currentUser={currentUser}/>} />
        <Route 
          path="/following" 
          element={isLoggedIn ? <Following currentUser={currentUser} /> : <Navigate to="/login" />} 
        />

        <Route 
          path="/manage-songs" 
          element={isLoggedIn && isArtist ? <SongsManagement currentUser={currentUser} /> : <Navigate to="/" />} 
        />
        <Route 
          path="/notifications" 
          element={isLoggedIn ? <Notification currentUser={currentUser}/> : <Navigate to="/login" />} 
        />

        <Route 
          path="/edit-song/:id" 
          element={isLoggedIn && isArtist ? <SongEdit /> : <Navigate to="/" />} 
        />

        <Route
            path="/feed"
            element={isLoggedIn ? <Feed currentUser={currentUser} /> : <Navigate to="/login" />}
        />

        <Route
            path="/songs/liked"
            element={isLoggedIn ? <LikedSongs currentUser={currentUser} /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFound />} />
        </Routes>
        <SongDetailModal />
        <SongPlayer />
      </Router>
    </PlayerProvider>
  );
}

export default App;