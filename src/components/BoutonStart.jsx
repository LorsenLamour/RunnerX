import React, { useRef, useState } from 'react';
import PixiCanvas from './PixiCanvas';
import GameMusic from './GameMusic';
import './ComponentsCss/StartPage.css';

const JeuAvecBouton = ({ castContext }) => {
  const [gameStarted, setGameStarted] = useState(false);
  const musicRef = useRef(null);

  const handleStart = () => {
    setGameStarted(true);
    if (musicRef.current) {
      musicRef.current.playMusic();
    }
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {!gameStarted && (
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#000',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <h1>Bienvenue au RunnerX</h1>
          <button
            onClick={handleStart}
            style={{
              fontSize: '24px',
              padding: '15px 30px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Commencer
          </button>
        </div>
      )}

      <GameMusic ref={musicRef} showControls={gameStarted} />

      {gameStarted && <PixiCanvas castContext={castContext} />}
    </div>
  );
};

export default JeuAvecBouton;
