import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import MusicPlayer from './components/MusicPlayer';
import LoadingScreen from './components/LoadingScreen';
import PlayerDisplay from './components/PlayerDisplay';

// This is your live backend URL
const a = 'https://musify-the-new-beat-production.up.railway.app';

// We keep playlistData hardcoded. We will fix this next.
const b = [
    { name: 'My Playlist #1', songs: [0, 1, 2], icon: 'fas fa-music' },
    { name: 'Road Trip Mix', songs: [3, 4, 5], icon: 'fas fa-car' },
    { name: 'Chill Vibes', songs: [1, 2, 7], icon: 'fas fa-leaf' },
];

function App() {
  const [c, d] = useState(true);
  const [e, f] = useState([]); 
  const [g, h] = useState(b);
  const [i, j] = useState(null);
  const [k, l] = useState(false);
  const [m, n] = useState('home');
  const [o, p] = useState(0.7);
  const [q, r] = useState(0.7);
  const [s, t] = useState(false);
  const [u, v] = useState(0);
  const [w, x] = useState([]);
  const [y, z] = useState([]);
  const [aa, ab] = useState(0);
  const [ac, ad] = useState(0);
  const [ae, af] = useState(false);
  
  const ag = useRef(new Audio());

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await fetch(`${a}/api/songs`); 
        const data = await response.json();
        
        f(data);
        
        const initialQueue = data.map((song, index) => index);
        x(initialQueue);
        z(initialQueue);
        
        d(false);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        d(false);
      }
    }
    fetchSongs();
  }, []);

  const ah = i !== null ? e[i] : null;

  const ai = useCallback((index) => {
    if (index === null || index < 0 || index >= e.length) return;
    
    const song = e[index];
    ag.current.src = song.url;
    ag.current.load();
    ag.current.play().catch(error => console.error("Playback failed:", error));
    
    j(index);
    l(true);
  }, [e]);

  const aj = () => {
    if (i === null) {
      ai(y[0] || 0);
      return;
    }
    if (k) ag.current.pause();
    else ag.current.play();
  };
  
  const ak = useCallback((direction) => {
    if (y.length === 0) return;
    const al = y.indexOf(i);
    let am;

    if(direction === 'next') {
        am = al + 1;
        if (am >= y.length) {
            if (u === 1) am = 0;
            else { l(false); return; }
        }
    } else {
        if (ag.current.currentTime > 3) {
            ag.current.currentTime = 0;
            return;
        }
        am = al - 1;
        if (am < 0) {
            if (u === 1) am = y.length - 1;
            else { ag.current.currentTime = 0; return; }
        }
    }
    ai(y[am]);
  }, [y, i, u, ai]);

  const an = useCallback(() => ak('next'), [ak]);
  const ao = useCallback(() => ak('prev'), [ak]);

  const ap = useCallback(() => {
    if (u === 2) ai(i);
    else an();
  }, [u, i, an, ai]);

  useEffect(() => {
    const audio = ag.current;
    const aq = () => ad(audio.duration);
    const ar = () => ab(audio.currentTime);
    audio.addEventListener('loadedmetadata', aq);
    audio.addEventListener('timeupdate', ar);
    audio.addEventListener('ended', ap);
    audio.addEventListener('play', () => l(true));
    audio.addEventListener('pause', () => l(false));
    return () => {
      audio.removeEventListener('loadedmetadata', aq);
      audio.removeEventListener('timeupdate', ar);
      audio.removeEventListener('ended', ap);
      audio.removeEventListener('play', () => l(true));
      audio.removeEventListener('pause', () => l(false));
    };
  }, [ap]);
  
  useEffect(() => { ag.current.volume = o; }, [o]);
  
  const as = (percent) => p(Math.max(0, Math.min(1, percent)));
  
  const at = () => {
    if (o > 0) {
        r(o);
        p(0);
    } else {
        p(q);
    }
  };
  
  const au = (percent) => {
    if(ah === null) return;
    ag.current.currentTime = percent * ah.duration;
  };
  
  const av = () => {
    const aw = !s;
    t(aw);
    if (aw) {
        const ax = y[0];
        let ay = y.slice(1);
        for (let i = ay.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [ay[i], ay[j]] = [ay[j], ay[i]];
        }
        z([ax, ...ay]);
    } else {
        const ax = y[0];
        const ay = [...w];
        ay.splice(ay.indexOf(ax), 1);
        ay.unshift(ax);
        z(ay);
    }
  };
  
  const az = () => v((ba) => (ba + 1) % 3);
  
  const ba = async (bb, bc) => {
    if (bb === null) return;
    try {
      const response = await fetch(`${a}/api/songs/like/${bb}`, {
        method: 'POST'
      });
      const bd = await response.json();

      f(be => {
        const bf = [...be];
        bf[bc] = bd;
        return bf;
      });

    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  const bg = (section) => n(section);
  
  const bh = (bi) => {
    const bj = g[bi];
    if (bj && bj.songs.length > 0) {
        z([...bj.songs]);
        ai(bj.songs[0]);
    }
  };
  
  const bk = () => {
     const name = prompt('Enter playlist name:');
     if (name && name.trim()) {
         h(bl => [
            ...bl, { name: name.trim(), songs: [], icon: 'fas fa-music' }
         ]);
     }
  };

  const bl = e.filter(song => song.isLiked);

  if (c) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Sidebar
        currentSection={m}
        switchSection={bg}
        playlists={g}
        playPlaylist={bh}
        createNewPlaylist={bk}
      />
      <MainContent
        currentSection={m}
        songs={e}
        likedSongsArray={bl} 
        playlists={g}
        playSong={ai}
        toggleLike={ba}
        playPlaylist={bh}
        queue={y}
        setQueue={z}
      />
      <MusicPlayer
        currentSong={ah}
        isPlaying={k}
        togglePlayPause={aj}
        nextSong={an}
        previousSong={ao}
        isLiked={ah ? ah.isLiked : false} 
        toggleLike={() => ba(ah._id, i)}
        volume={o}
        setVolume={as}
        toggleMute={at}
        currentTime={aa}
        duration={ac}
        setProgress={au}
        isShuffled={s}
        toggleShuffle={av}
        repeatMode={u}
        toggleRepeat={az}
        onShowPlayerDisplay={() => af(true)}
      />
      <PlayerDisplay
        show={ae}
        onClose={() => af(false)}
        currentSong={ah}
        isPlaying={k}
        togglePlayPause={aj}
        nextSong={an}
        previousSong={ao}
        currentTime={aa}
        duration={ac}
        setProgress={au}
        isShuffled={s}
        toggleShuffle={av}
        repeatMode={u}
        toggleRepeat={az}
      />
      <audio ref={ag} preload="metadata"></audio>
    </div>
  );
}

export default App;