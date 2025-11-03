import React, { useState } from 'react';

function Library({ songs, playlists, playPlaylist }) {
  const [activeTab, setActiveTab] = useState('playlists');

  return (
    <>
      <div className="library-header">
        <h1>Your Library</h1>
        <div className="library-actions">
          <button className="library-btn">
            <i className="fas fa-search"></i>
          </button>
          <button className="library-btn">
            <i className="fas fa-sort"></i>
          </button>
        </div>
      </div>
      <div className="library-content">
        <div className="library-tabs">
          <button
            className={`lib-tab ${activeTab === 'playlists' ? 'active' : ''}`}
            onClick={() => setActiveTab('playlists')}
          >
            Playlists
          </button>
          <button
            className={`lib-tab ${activeTab === 'artists' ? 'active' : ''}`}
            onClick={() => setActiveTab('artists')}
          >
            Artists
          </button>
          <button
            className={`lib-tab ${activeTab === 'albums' ? 'active' : ''}`}
            onClick={() => setActiveTab('albums')}
          >
            Albums
          </button>
        </div>
        <div className="library-list">
          {activeTab === 'playlists' && playlists.map((p, index) => (
            <div key={index} className="library-item" onClick={() => playPlaylist(index)}>
              <img src={songs[p.songs[0]].image} alt={p.name} />
              <div className="library-info">
                <h4>{p.name}</h4>
                <p>Playlist • {p.songs.length} songs</p>
              </div>
              <div className="library-item-actions">
                <button className="library-action-btn"><i className="fas fa-play"></i></button>
              </div>
            </div>
          ))}
          {activeTab !== 'playlists' && (
            <p style={{padding: '20px'}}>Content for {activeTab} goes here.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default Library;