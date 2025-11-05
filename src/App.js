import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import MusicPlayer from './components/MusicPlayer';
import LoadingScreen from './components/LoadingScreen';
import PlayerDisplay from './components/PlayerDisplay';

// We keep playlistData hardcoded for now.
const playlistData = [
    { name: 'My Playlist #1', songs: [0, 1, 2], icon: 'fas fa-music' },
    { name: 'Road Trip Mix', songs: [3, 4, 5], icon: 'fas fa-car' },
    { name: 'Chill Vibes', songs: [1, 2, 7], icon: 'fas fa-leaf' },
];

function App() {
  const [loading, setLoading] = useState(true);

  // We start with an EMPTY array for songs
  const [songs, setSongs] = useState([]); 

  const [playlists, setPlaylists] = useState(playlistData);

  // We keep likedSongs local for now.
  const [likedSongs, setLikedSongs] = useState(new Set([1, 4]));

  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [volume, setVolume] = useState(0.7);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);

  const [originalQueue, setOriginalQueue] = useState([]);
  const [queue, setQueue] = useState([]);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayerDisplay, setShowPlayerDisplay] = useState(false);

  const audioPlayer = useRef(new Audio());

  // --- THIS IS THE NEW CODE ---
  // This hook runs once when the app loads
  useEffect(() => {
    async function fetchSongs() {
      try {
        // We can use '/api/songs' because of the proxy we set up
        const response = await fetch('/api/songs'); 
        const data = await response.json();

        setSongs(data); // Put the songs from the database into our state

        // Set up the queues now that we have songs
        const initialQueue = [...Array(data.length).keys()];
        setOriginalQueue(initialQueue);
        setQueue(initialQueue);

        setLoading(false); // Stop the loading screen
      } catch (error) {
        console.error("Failed to fetch songs:", error);
        setLoading(false); // Stop loading even if it fails
      }
    }

    fetchSongs();
  }, []); // The empty array [] means "run this only once"
  // --- END OF NEW CODE ---

  const currentSong = currentSongIndex !== null ? songs[currentSongIndex] : null;

  const playSong = useCallback((index) => {
    if (index === null || index < 0 || index >= songs.length) return;

    const song = songs[index];
    audioPlayer.current.src = song.url;
    audioPlayer.current.load();
    audioPlayer.current.play().catch(error => console.error("Playback failed:", error));

    setCurrentSongIndex(index);
    setIsPlaying(true);
  }, [songs]);

  const togglePlayPause = () => {
    if (currentSongIndex === null) {
      playSong(queue[0] || 0);
      return;
    }

    if (isPlaying) {
      audioPlayer.current.pause();
    } else {
      audioPlayer.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSong = useCallback((direction) => {
    if (queue.length === 0) return;
    const currentQueueIndex = queue.indexOf(currentSongIndex);
    let nextQueueIndex;

    if(direction === 'next') {
        nextQueueIndex = currentQueueIndex + 1;
        if (nextQueueIndex >= queue.length) {
            if (repeatMode === 1) nextQueueIndex = 0;
            else { setIsPlaying(false); return; }
        }
    } else {
        if (audioPlayer.current.currentTime > 3) {
            audioPlayer.current.currentTime = 0;
            return;
        }
        nextQueueIndex = currentQueueIndex - 1;
        if (nextQueueIndex < 0) {
            if (repeatMode === 1) nextQueueIndex = queue.length - 1;
            else { audioPlayer.current.currentTime = 0; return; }
        }
    }
    playSong(queue[nextQueueIndex]);
  }, [queue, currentSongIndex, repeatMode, playSong]);

  const nextSong = useCallback(() => changeSong('next'), [changeSong]);
  const previousSong = useCallback(() => changeSong('prev'), [changeSong]);

  const handleSongEnd = useCallback(() => {
    if (repeatMode === 2) {
        playSong(currentSongIndex);
    } else {
        nextSong();
    }
  }, [repeatMode, currentSongIndex, nextSong, playSong]);

  useEffect(() => {
    const audio = audioPlayer.current;

    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleSongEnd);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleSongEnd);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, [handleSongEnd]);

  useEffect(() => {
    audioPlayer.current.volume = volume;
  }, [volume]);

  const setAudioVolume = (percent) => {
    const newVolume = Math.max(0, Math.min(1, percent));
    setVolume(newVolume);
  };

  const toggleMute = () => {
    if (volume > 0) {
        setPreviousVolume(volume);
        setVolume(0);
    } else {
        setVolume(previousVolume);
    }
  };

  const setAudioProgress = (percent) => {
    if(currentSong === null) return;
    audioPlayer.current.currentTime = percent * currentSong.duration;
  };

  const toggleShuffle = () => {
    const newIsShuffled = !isShuffled;
    setIsShuffled(newIsShuffled);

    if (newIsShuffled) {
        const currentSong = queue[0];
        let restOfQueue = queue.slice(1);
        for (let i = restOfQueue.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [restOfQueue[i], restOfQueue[j]] = [restOfQueue[j], restOfQueue[i]];
        }
        setQueue([currentSong, ...restOfQueue]);
    } else {
        const currentSong = queue[0];
        const newQueue = [...originalQueue];
        newQueue.splice(newQueue.indexOf(currentSong), 1);
        newQueue.unshift(currentSong);
        setQueue(newQueue);
    }
  };

  const toggleRepeat = () => {
    setRepeatMode((prevMode) => (prevMode + 1) % 3);
  };

  const toggleLike = (songIndex) => {
    if (songIndex === null) return;
    const newLikedSongs = new Set(likedSongs);
    if (newLikedSongs.has(songIndex)) {
        newLikedSongs.delete(songIndex);
    } else {
        newLikedSongs.add(songIndex);
    }
    setLikedSongs(newLikedSongs);
  };

  const switchSection = (section) => {
    setCurrentSection(section);
  };

  const playPlaylist = (playlistIndex) => {
    const playlist = playlists[playlistIndex];
    if (playlist && playlist.songs.length > 0) {
        setQueue([...playlist.songs]);
        playSong(playlist.songs[0]);
    }
  };

  const createNewPlaylist = () => {
    const name = prompt('Enter playlist name:');
    if (name && name.trim()) {
        setPlaylists(prev => [
            ...prev,
            { name: name.trim(), songs: [], icon: 'fas fa-music' }
        ]);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <Sidebar
        currentSection={currentSection}
        switchSection={switchSection}
        playlists={playlists}
        playPlaylist={playPlaylist}
        createNewPlaylist={createNewPlaylist}
      />
      <MainContent
        currentSection={currentSection}
        songs={songs}
        likedSongs={likedSongs}
        playlists={playlists}
        playSong={playSong}
        toggleLike={toggleLike}
        playPlaylist={playPlaylist}
        queue={queue}
        setQueue={setQueue}
      />
      <MusicPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        nextSong={nextSong}
        previousSong={previousSong}
        isLiked={currentSongIndex !== null && likedSongs.has(currentSongIndex)}
        toggleLike={() => toggleLike(currentSongIndex)}
        volume={volume}
        setVolume={setAudioVolume}
        toggleMute={toggleMute}
        currentTime={currentTime}
        duration={duration}
        setProgress={setAudioProgress}
        isShuffled={isShuffled}
        toggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        toggleRepeat={toggleRepeat}
        onShowPlayerDisplay={() => setShowPlayerDisplay(true)}
      />
      <PlayerDisplay
        show={showPlayerDisplay}
        onClose={() => setShowPlayerDisplay(false)}
        currentSong={currentSong}
        isPlaying={isPlaying}
        togglePlayPause={togglePlayPause}
        nextSong={nextSong}
        previousSong={previousSong}
        currentTime={currentTime}
        duration={duration}
        setProgress={setAudioProgress}
        isShuffled={isShuffled}
        toggleShuffle={toggleShuffle}
        repeatMode={repeatMode}
        toggleRepeat={toggleRepeat}
      />
      <audio ref={audioPlayer} preload="metadata"></audio>
    </div>
  );
}

export default App;