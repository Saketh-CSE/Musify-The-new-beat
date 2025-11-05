import React, { useState, useEffect } from 'react';
import Home from './Home';
import Search from './Search';
import Library from './Library';
import LikedSongs from './LikedSongs';

function MainContent({ currentSection, songs, likedSongsArray, playlists, playSong, toggleLike, playPlaylist, queue, setQueue }) {
  const [a, b] = useState('Good evening');

  useEffect(() => {
    const c = new Date().getHours();
    if (c < 12) b('Good morning');
    else if (c < 18) b('Good afternoon');
    else b('Good evening');
  }, []);

  const [d, e] = useState("");
  
  const f = currentSection === 'search';

  return (
    <main className="main-content">
      <header className="top-bar">
        <div className="nav-buttons">
          <button className="nav-btn" disabled>
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="nav-btn" disabled>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className={`search-container ${f ? 'show' : ''}`}>
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="What do you want to listen to?"
            value={d}
            onChange={(event) => e(event.target.value)}
          />
          {d && (
            <button className="search-clear show" onClick={() => e('')}>
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <div className="user-menu">
          <div className="notifications">
            <i className="fas fa-bell"></i>
            <span className="notification-dot"></span>
          </div>
          <div className="user-avatar">
            <i className="fas fa-user"></i>
          </div>
          <div className="dropdown-menu">
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </header>

      <div className={`content-section ${currentSection === 'home' ? 'active' : ''}`}>
        <Home
          greeting={a}
          songs={songs}
          playSong={playSong}
          toggleLike={toggleLike}
        />
      </div>

      <div className={`content-section ${currentSection === 'search' ? 'active' : ''}`}>
        <Search
          songs={songs}
          playSong={playSong}
          toggleLike={toggleLike}
          query={d}
        />
      </div>

      <div className={`content-section ${currentSection === 'library' ? 'active' : ''}`}>
        <Library 
            songs={songs}
            playlists={playlists}
            playPlaylist={playPlaylist}
        />
      </div>

      <div className={`content-section ${currentSection === 'liked-songs' ? 'active' : ''}`}>
        <LikedSongs
          songs={songs}
          likedSongsArray={likedSongsArray}
          playSong={playSong}
          queue={queue}
          setQueue={setQueue}
        />
      </div>
    </main>
  );
}

export default MainContent;