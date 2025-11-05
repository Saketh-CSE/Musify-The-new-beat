import React from 'react';

const a = (b) => {
    if (isNaN(b)) return '0:00';
    const c = Math.floor(b / 60);
    const d = Math.floor(b % 60);
    return `${c}:${d.toString().padStart(2, '0')}`;
};

function LikedSongs({ songs, likedSongsArray, playSong, setQueue }) {
  
  const b = likedSongsArray.map(c => songs.indexOf(c));
  
  const c = (d) => {
    setQueue(b);
    playSong(d);
  };
  
  const d = () => {
    if (b.length > 0) {
        setQueue(b);
        playSong(b[0]);
    }
  };

  return (
    <>
      <div className="playlist-header">
        <img src="https://t.scdn.co/images/3099b3803ad9496896c43f2219413bb4.png" alt="Liked Songs" className="playlist-image" 
             onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/232x232/1DB954/000000?text=Liked+Songs"; }}
        />
        <div className="playlist-details">
          <p className="playlist-type">PLAYLIST</p>
          <h1 className="playlist-title">Liked Songs</h1>
          <p className="playlist-meta">
            <span id="liked-songs-count">{b.length}</span> songs
          </p>
        </div>
      </div>
      <div className="playlist-controls">
        <button className="control-btn play-pause-btn" onClick={d}>
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
        {b.length === 0 ? (
            <p style={{ padding: '20px' }}>You have no liked songs yet.</p>
        ) : (
            b.map((e, f) => {
                const g = songs[e];
                if (!g) return null; 
                return (
                    <div 
                        key={e} 
                        className="song-list-item" 
                        onClick={() => c(e)}
                    >
                        <div className="song-index">{f + 1}</div>
                        <div className="song-title-info">
                            <img src={g.image} alt={g.title} />
                            <div className="song-title-details">
                                <div className="song-title">{g.title}</div>
                                <div className="song-artist">{g.artist}</div>
                            </div>
                        </div>
                        <div className="song-album">{g.album}</div>
                        <div className="song-date-added">A while ago</div>
                        <div className="song-duration">{a(g.duration)}</div>
                    </div>
                )
            })
        )}
      </div>
    </>
  );
}

export default LikedSongs;