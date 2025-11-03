import React from 'react';
import MusicCard from './MusicCard';
import ArtistCard from './ArtistCard';

function Home({ greeting, songs, likedSongs, playSong, toggleLike }) {
  
  const quickPicks = songs.slice(0, 4);
  const recentlyPlayed = songs.slice(0, 5);
  const madeForYou = songs.slice(5, 8);
  const artists = [...new Set(songs.map(s => s.artist))].slice(0, 5);

  return (
    <>
      <div className="greeting">
        <h1>{greeting}</h1>
        <p className="greeting-subtitle">Ready to discover your next favorite song?</p>
      </div>

      <div className="quick-picks">
        {quickPicks.map((song, index) => {
           const originalIndex = songs.indexOf(song);
           return (
            <div key={originalIndex} className="quick-pick-item" onClick={() => playSong(originalIndex)}>
                <img src={song.image} alt={song.title} />
                <span>{song.title}</span>
                <button className="play-btn">
                    <i className="fas fa-play"></i>
                </button>
            </div>
           )
        })}
      </div>

      <section className="content-row">
        <div className="section-header">
          <h2>Recently played</h2>
          <button className="show-all-btn">Show all</button>
        </div>
        <div className="card-grid">
          {recentlyPlayed.map((song, index) => {
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
      </section>

      <section className="content-row">
        <div className="section-header">
          <h2>Made for you</h2>
          <button className="show-all-btn">Show all</button>
        </div>
        <div className="card-grid">
          {madeForYou.map((song, index) => {
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
      </section>

      <section className="content-row">
        <div className="section-header">
          <h2>Popular artists</h2>
          <button className="show-all-btn">Show all</button>
        </div>
        <div className="artist-grid">
          {artists.map((artistName) => {
            const song = songs.find(s => s.artist === artistName);
            return (
                <ArtistCard 
                    key={artistName}
                    artist={artistName}
                    image={song.image}
                />
            )
          })}
        </div>
      </section>
    </>
  );
}

export default Home;