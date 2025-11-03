import React from 'react';

function Sidebar({ currentSection, switchSection, playlists, playPlaylist, createNewPlaylist }) {
  
  const handleNavClick = (e, section) => {
    e.preventDefault();
    switchSection(section);
  };
  
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <i className="fas fa-music"></i>
          </div>
          <span className="logo-text">Musify</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-group">
          <button
            type="button"
            className={`nav-item ${currentSection === 'home' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'home')}
          >
            <i className="fas fa-home nav-icon"></i>
            <span className="nav-text">Home</span>
          </button>
          <button
            type="button"
            className={`nav-item ${currentSection === 'search' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'search')}
          >
            <i className="fas fa-search nav-icon"></i>
            <span className="nav-text">Search</span>
          </button>
          <button
            type="button"
            className={`nav-item ${currentSection === 'library' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'library')}
          >
            <i className="fas fa-book nav-icon"></i>
            <span className="nav-text">Your Library</span>
          </button>
        </div>

        <div className="nav-group">
          <button type="button" className="nav-item" onClick={createNewPlaylist}>
            <i className="fas fa-plus nav-icon"></i>
            <span className="nav-text">Create Playlist</span>
          </button>
          <button
            type="button"
            className={`nav-item ${currentSection === 'liked-songs' ? 'active' : ''}`}
            onClick={(e) => handleNavClick(e, 'liked-songs')}
          >
            <i className="fas fa-heart nav-icon"></i>
            <span className="nav-text">Liked Songs</span>
          </button>
        </div>

        <div className="playlists">
          {playlists.map((playlist, index) => (
            <div 
              key={index} 
              className="playlist-item" 
              onClick={() => playPlaylist(index)}
            >
              <i className={playlist.icon}></i> {playlist.name}
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
