import React from 'react';
import PixiCanvas from './PixiCanvas';
import './ComponentsCss/StartPage.css';

const JeuAvecBouton = ({ castContext }) => {
  const [gameStarted, setGameStarted] = React.useState(false);

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000', // fond noir avant que le jeu commence
    }}>
      <div className='messageStartDiv'>
        <h1 className='messageStart'>  Bienvenu au RunnerX </h1>
      </div>
      {!gameStarted ? (
        <button
          onClick={() => setGameStarted(true)}
          style={{
            fontSize: '24px',
            padding: '15px 30px',
            cursor: 'pointer',
          }}
        >
          Commencer
        </button>
      ) : (
        <PixiCanvas castContext={castContext} />

      )}
    </div>
  );
};

export default JeuAvecBouton;
