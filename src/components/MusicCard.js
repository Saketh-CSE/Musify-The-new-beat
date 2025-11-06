import React from 'react';

function MusicCard({ song, songIndex, isLiked, playSong, toggleLike }) {
  return (
    <div className="music-card">
      <div className="card-image">
        <img 
          src={song.image || 'https://placehold.co/300x300/1DB954/ffffff?text=No+Image'} 
          alt={song.title} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x300/1DB954/ffffff?text=No+Image';
          }}
        />
        <div className="card-overlay">
          <button className="card-play-btn" onClick={() => playSong(songIndex)}>
            <i className="fas fa-play"></i>
          </button>
        </div>
        <div className="card-actions">
          <button
            className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
            onClick={() => toggleLike(songIndex)}
          >
            <i className="fas fa-heart"></i>
          </button>
          <button className="action-btn more-btn">
            <i className="fas fa-ellipsis-h"></i>
          </button>
        </div>
      </div>
      <div className="card-content">
        <h3>{song.title}</h3>
        <p>{song.artist}</p>
      </div>
    </div>
  );
}

export default MusicCard;
