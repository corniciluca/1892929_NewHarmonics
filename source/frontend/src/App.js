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

import MySongs from './routes/MySongs';
import SongsManagement from './routes/SongsManagement';
import Following from './routes/Following';
import Dashboard from './routes/Dashboard';
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

  // 2. CREA LA NUOVA FUNZIONE DI FETCH
  const fetchAndSetUser = () => {
    setIsLoading(true);
    // Prima, controlla se il token è valido
    checkLoginStatus()
      .then(validationResponse => {
        const isValidId = validationResponse.userId !== null &&
                                  validationResponse.userId !== undefined &&
                                  validationResponse.userId !== "undefined" &&
                                  !isNaN(parseInt(validationResponse.userId))
        if (validationResponse.valid && isValidId) { // Use the new check
          // Se valido, usa lo userId per prendere i dati completi
          return getUserById(validationResponse.userId);
        } else {
          // Se non è valido, lancia un errore per andare al .catch()
          throw new Error("Sessione non valida o scaduta.");
        }
      })
      .then(user => {
        // Ora abbiamo l'oggetto utente completo!
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
      .catch(() => {
        // Se un qualunque passaggio fallisce, esegui il logout
        setCurrentUser(null);
        localStorage.clear();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // All'avvio dell'app, controlla se c'è una sessione attiva
// 3. USA LA NUOVA FUNZIONE in useEffect
  useEffect(() => {
    // Non controlla più localStorage, chiama direttamente la nuova funzione
    fetchAndSetUser();
  }, []);

  const handleLoginSuccess = () => {
    fetchAndSetUser();
  };

  const handleLogout = () => {
    logout(); // This just clears localStorage
    setCurrentUser(null);
  };

  const handleUserUpdate = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  if (isLoading) {
    return <div>Loading...</div>; // O uno spinner di caricamento
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
        
        {/* 4. Add all your missing routes */}
        <Route 
          path="/dashboard" 
          element={isLoggedIn ? <Dashboard currentUser={currentUser} /> : <Navigate to="/login" />} 
        />
        <Route path="/search" element={<SearchResults currentUser={currentUser}/>} />
        <Route 
          path="/following" 
          element={isLoggedIn ? <Following currentUser={currentUser} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/mysongs" 
          element={isLoggedIn && isArtist ? <MySongs currentUser={currentUser} /> : <Navigate to="/" />} 
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