import React from 'react';

function ArtistCard({ artist, image }) {
  return (
    <div className="artist-card">
      <div className="artist-image">
        <img 
          src={image || 'https://placehold.co/300x300/1DB954/ffffff?text=Artist'} 
          alt={artist} 
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/300x300/1DB954/ffffff?text=Artist';
          }}
        />
        <button className="artist-play-btn">
          <i className="fas fa-play"></i>
        </button>
      </div>
      <div className="artist-info">
        <h3>{artist}</h3>
        <p>Artist</p>
      </div>
    </div>
  );
}

export default ArtistCard;
