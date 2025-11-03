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

function VolumeSlider({ volume, setVolume }) {
    
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setVolume(percent);
  };
    
  return (
    <div className="volume-slider" onClick={handleClick}>
        <div className="volume-fill" style={{ width: `${volume * 100}%`}}></div>
    </div>
  );
}

function MusicPlayer({
  currentSong,
  isPlaying,
  togglePlayPause,
  nextSong,
  previousSong,
  isLiked,
  toggleLike,
  volume,
  setVolume,
  toggleMute,
  currentTime,
  duration,
  setProgress,
  isShuffled,
  toggleShuffle,
  repeatMode,
  toggleRepeat,
  onShowPlayerDisplay
}) {
  
  const volumeIcon = volume === 0 ? 'fa-volume-mute' : volume < 0.5 ? 'fa-volume-down' : 'fa-volume-up';
  
  let repeatIcon = 'fa-redo';
  if (repeatMode === 2) repeatIcon = 'fa-redo-alt fa-1';

  return (
    <footer className="music-player">
      <div className="player-left">
        <div className="current-track-image" onClick={onShowPlayerDisplay} style={{ cursor: 'pointer' }}>
          <img 
            src={currentSong ? currentSong.image : 'https://placehold.co/80x80/121212/1db954?text=Musify'} 
            alt="Current Track"
          />
          <div className={`track-animation ${isPlaying ? 'playing' : ''}`}>
            <div className="wave"></div>
            <div className="wave"></div>
            <div className="wave"></div>
          </div>
        </div>
        <div className="current-track-info">
          <h4>{currentSong ? currentSong.title : 'Welcome to Musify'}</h4>
          <p>{currentSong ? currentSong.artist : 'Select a song to play'}</p>
        </div>
        <button className={`heart-btn ${isLiked ? 'liked' : ''}`} onClick={toggleLike}>
          <i className={isLiked ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
      </div>

      <div className="player-center">
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
        <div className="progress-container">
          <span className="time">{formatTime(currentTime)}</span>
          <ProgressBar duration={duration} currentTime={currentTime} setProgress={setProgress} />
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <button className="control-btn">
          <i className="fas fa-list"></i>
        </button>
        <button className="control-btn">
          <i className="fas fa-desktop"></i>
        </button>
        <div className="volume-container">
          <button className="control-btn" onClick={toggleMute}>
            <i className={`fas ${volumeIcon}`}></i>
          </button>
          <VolumeSlider volume={volume} setVolume={setVolume} />
        </div>
        <button className="control-btn" onClick={onShowPlayerDisplay}>
          <i className="fas fa-expand"></i>
        </button>
      </div>
    </footer>
  );
}

export default MusicPlayer;