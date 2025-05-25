import React, { useRef, useImperativeHandle, forwardRef, useState } from 'react';
const GameMusic = forwardRef((props, ref) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    playMusic() {
      if (audioRef.current) {
        audioRef.current.volume = 0.5;
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(err => {
          console.warn("Lecture bloquée :", err);
        });
      }
    },
    pauseMusic() {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }));

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.warn("Lecture bloquée :", err);
      });
    }
  };

  return (
    <div style={{ position: 'absolute', top: 10,padding: '5px 10px', right: 50, zIndex: 20 }}>
      <audio ref={audioRef} loop>
        <source src="/music/background-music.mp3" type="audio/mpeg" />
      </audio>
      {props.showControls && (
        <button onClick={toggleMusic}>
          {isPlaying ? 'Pause 🎵' : 'Play 🎵'}
        </button>
      )}
    </div>
  );
});

export default GameMusic;
