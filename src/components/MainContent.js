import React, { useState, useEffect } from 'react';
import Home from './Home';
import Search from './Search';
import Library from './Library';
import LikedSongs from './LikedSongs';

function MainContent({ currentSection, songs, likedSongs, playlists, playSong, toggleLike, playPlaylist, queue, setQueue }) {
  const [greeting, setGreeting] = useState('Good evening');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const [searchInput, setSearchInput] = useState("");
  
  const showSearch = currentSection === 'search';

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
        <div className={`search-container ${showSearch ? 'show' : ''}`}>
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="What do you want to listen to?"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          {searchInput && (
            <button className="search-clear show" onClick={() => setSearchInput('')}>
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
          greeting={greeting}
          songs={songs}
          likedSongs={likedSongs}
          playSong={playSong}
          toggleLike={toggleLike}
        />
      </div>

      <div className={`content-section ${currentSection === 'search' ? 'active' : ''}`}>
        <Search
          songs={songs}
          likedSongs={likedSongs}
          playSong={playSong}
          toggleLike={toggleLike}
          query={searchInput}
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
          likedSongs={likedSongs}
          playSong={playSong}
          queue={queue}
          setQueue={setQueue}
        />
      </div>
    </main>
  );
}

export default MainContent;