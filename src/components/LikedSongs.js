import React from 'react';

const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

function LikedSongs({ songs, likedSongs, playSong, setQueue }) {
  
  const likedArray = Array.from(likedSongs);
  
  const handleSongClick = (songIndex) => {
    setQueue(likedArray);
    playSong(songIndex);
  };
  
  const playAllLiked = () => {
    if (likedArray.length > 0) {
        setQueue(likedArray);
        playSong(likedArray[0]);
    }
  };

  return (
    <>
      <div className="playlist-header">
        <img src="https://t.scdn.co/images/3099b3803ad9496896c43f2219413bb4.png" alt="Liked Songs" className="playlist-image" />
        <div className="playlist-details">
          <p className="playlist-type">PLAYLIST</p>
          <h1 className="playlist-title">Liked Songs</h1>
          <p className="playlist-meta">
            <span id="liked-songs-count">{likedArray.length}</span> songs
          </p>
        </div>
      </div>
      <div className="playlist-controls">
        <button className="control-btn play-pause-btn" onClick={playAllLiked}>
          <i className="fas fa-play"></i>
        </button>
      </div>
      <div className="song-list-header">
        <div className="song-header-item">#</div>
        <div className="song-header-item">Title</div>
        <div className="song-header-item">Album</div>
        <div className="song-header-item">Date Added</div>
        <div className="song-header-item"><i className="far fa-clock"></i></div>
      </div>
      <div className="song-list" id="liked-songs-list">
        {likedArray.length === 0 ? (
            <p style={{ padding: '20px' }}>You have no liked songs yet.</p>
        ) : (
            likedArray.map((songIndex, i) => {
                const song = songs[songIndex];
                return (
                    <div 
                        key={songIndex} 
                        className="song-list-item" 
                        onClick={() => handleSongClick(songIndex)}
                    >
                        <div className="song-index">{i + 1}</div>
                        <div className="song-title-info">
                            <img src={song.image} alt={song.title} />
                            <div className="song-title-details">
                                <div className="song-title">{song.title}</div>
                                <div className="song-artist">{song.artist}</div>
                            </div>
                        </div>
                        <div className="song-album">{song.album}</div>
                        <div className="song-date-added">A while ago</div>
                        <div className="song-duration">{formatTime(song.duration)}</div>
                    </div>
                )
            })
        )}
      </div>
    </>
  );
}

export default LikedSongs;