import React from 'react';

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

function ProgressBar({ duration, currentTime, setProgress }) {
  const progressPercent = (currentTime / duration) * 100 || 0;

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setProgress(percent);
  };

  return (
    <div className="progress-bar" onClick={handleClick}>
      <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
    </div>
  );
}

function PlayerDisplay({
    show,
    onClose,
    currentSong,
    isPlaying,
    togglePlayPause,
    nextSong,
    previousSong,
    currentTime,
    duration,
    setProgress,
    isShuffled,
    toggleShuffle,
    repeatMode,
    toggleRepeat
}) {

    let repeatIcon = 'fa-redo';
    if (repeatMode === 2) repeatIcon = 'fa-redo-alt fa-1';
    
    if (!currentSong) return null;

    const backgroundImage = currentSong.image || 'https://placehold.co/600x600/1DB954/ffffff?text=Musify';
    const albumImage = currentSong.image || 'https://placehold.co/400x400/1DB954/ffffff?text=Album';

    return (
        <div className={`player-display ${show ? 'show' : ''}`}>
            <div 
                className="player-display-background"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            ></div>
            <div className="player-display-content">
                <button className="player-display-close" onClick={onClose}>
                    <i className="fas fa-chevron-down"></i>
                </button>
                <div className="player-display-art">
                    <img 
                      src={albumImage}
                      alt={currentSong.title}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/400x400/1DB954/ffffff?text=Album';
                      }}
                    />
                </div>
                <div className="player-display-info">
                    <h2>{currentSong.title}</h2>
                    <p>{currentSong.artist}</p>
                </div>
                <div className="player-display-controls">
                    <div className="progress-container">
                        <span className="time">{formatTime(currentTime)}</span>
                        <ProgressBar duration={duration} currentTime={currentTime} setProgress={setProgress} />
                        <span className="time">{formatTime(duration)}</span>
                    </div>
                    <div className="player-controls">
                        <button className={`control-btn ${isShuffled ? 'active' : ''}`} onClick={toggleShuffle}>
                            <i className="fas fa-random"></i>
                        </button>
                        <button className="control-btn" onClick={previousSong}>
                            <i className="fas fa-step-backward"></i>
                        </button>
                        <button className="control-btn play-pause-btn" onClick={togglePlayPause}>
                            <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                        </button>
                        <button className="control-btn" onClick={nextSong}>
                            <i className="fas fa-step-forward"></i>
                        </button>
                        <button className={`control-btn ${repeatMode > 0 ? 'active' : ''}`} onClick={toggleRepeat}>
                            <i className={`fas ${repeatIcon}`}></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PlayerDisplay;
