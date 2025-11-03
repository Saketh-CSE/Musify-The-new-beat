import React from 'react';
import MusicCard from './MusicCard';

function Search({ songs, likedSongs, playSong, toggleLike, query }) {
  
  const categories = [
    { name: 'Pop', style: { background: 'linear-gradient(135deg, #1DB954, #1ed760)' }, icon: 'fa-star' },
    { name: 'Rock', style: { background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)' }, icon: 'fa-guitar' },
    { name: 'Hip-Hop', style: { background: 'linear-gradient(135deg, #4ecdc4, #44a08d)' }, icon: 'fa-microphone' },
    { name: 'Electronic', style: { background: 'linear-gradient(135deg, #a8edea, #fed6e3)' }, icon: 'fa-bolt' },
    { name: 'Jazz', style: { background: 'linear-gradient(135deg, #ffd89b, #19547b)' }, icon: 'fa-music-alt' },
    { name: 'Classical', style: { background: 'linear-gradient(135deg, #667eea, #764ba2)' }, icon: 'fa-music' },
  ];
  
  const filteredSongs = songs.filter(s => 
    s.title.toLowerCase().includes(query.toLowerCase()) ||
    s.artist.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="search-content">
      {query.trim() === '' ? (
        <div id="search-default-view">
          <h1>Search</h1>
          <div className="browse-categories">
            <h2>Browse all</h2>
            <div className="category-grid">
              {categories.map(cat => (
                <div key={cat.name} className="category-card" style={cat.style}>
                  <h3>{cat.name}</h3>
                  <i className={`fas ${cat.icon} category-icon`}></i>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="search-results" id="search-results">
          <h2>Search results</h2>
          <div className="card-grid">
            {filteredSongs.map((song) => {
                 const originalIndex = songs.indexOf(song);
                 return (
                    <MusicCard
                        key={originalIndex}
                        song={song}
                        songIndex={originalIndex}
                        isLiked={likedSongs.has(originalIndex)}
                        playSong={playSong}
                        toggleLike={toggleLike}
                    />
                 )
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Search;