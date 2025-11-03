import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import MusicPlayer from './components/MusicPlayer';
import LoadingScreen from './components/LoadingScreen';
import PlayerDisplay from './components/PlayerDisplay';

const songData = [
    { title: 'Lost in the City', artist: 'Cosmo Sheldrake', album: 'The Much Much How How and I', duration: 212, image: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Forest Temple', artist: 'Koji Kondo', album: 'The Legend of Zelda', duration: 172, image: 'https://images.pexels.com/photos/3225517/pexels-photo-3225517.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: 'Aqua Vitae', artist: 'Future World Music', album: 'Behold', duration: 259, image: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { title: 'Chasing the Wind', artist: 'Twelve Titans Music', album: 'Evermore', duration: 184, image: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' },
    { title: 'The Last Butterfly', artist: 'Clem Leek', album: 'Rest', duration: 162, image: 'https://images.pexels.com/photos/672101/pexels-photo-672101.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3' },
    { title: 'A New Day', artist: 'Altan', album: 'The Widening Gyre', duration: 234, image: 'https://images.pexels.com/photos/1757363/pexels-photo-1757363.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3' },
    { title: 'The Shire', artist: 'Howard Shore', album: 'The Lord of the Rings', duration: 135, image: 'https://images.pexels.com/photos/2361/nature-farm-agriculture-green.jpg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3' },
    { title: 'Victory', artist: 'Two Steps From Hell', album: 'Battlecry', duration: 320, image: 'https://images.pexels.com/photos/842711/pexels-photo-842711.jpeg?auto=compress&cs=tinysrgb&w=300', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' },
];

const playlistData = [
    { name: 'My Playlist #1', songs: [0, 1, 2], icon: 'fas fa-music' },
    { name: 'Road Trip Mix', songs: [3, 4, 5], icon: 'fas fa-car' },
    { name: 'Chill Vibes', songs: [1, 2, 7], icon: 'fas fa-leaf' },
];

function App() {
  const [loading, setLoading] = useState(true);
  const [songs] = useState(songData);
  const [playlists, setPlaylists] = useState(playlistData);
  const [likedSongs, setLikedSongs] = useState(new Set([1, 4]));
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSection, setCurrentSection] = useState('home');
  const [volume, setVolume] = useState(0.7);
  const [previousVolume, setPreviousVolume] = useState(0.7);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  
  const [originalQueue] = useState([...Array(songs.length).keys()]);
  const [queue, setQueue] = useState([...originalQueue]);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlayerDisplay, setShowPlayerDisplay] = useState(false);
  
  const audioPlayer = useRef(new Audio());

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

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
