import React from 'react';

function LoadingScreen() {
  return (
    <div className="loading-screen" id="loading-screen">
      <div className="loading-content">
        <div className="loading-logo">
          <i className="fas fa-music"></i>
          <span>Musify</span>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
        <p>Loading your music...</p>
      </div>
    </div>
  );
}

export default LoadingScreen;