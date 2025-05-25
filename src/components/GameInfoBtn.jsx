import React, { useState } from 'react';
import './componentsCss/GameInfoBtn.css'; // Pour le style si tu veux séparer

const GameInfoButton = () => {
  const [showInfo, setShowInfo] = useState(false);

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 10 }}>
      <button className="info-button" onClick={toggleInfo}>i</button>
      {showInfo && (
        <div className="info-box">
          <h4>Informations du jeu</h4>
          <p><strong>Objectif :</strong> Atteindre le portail sans mourir.</p>
          <p><strong>Contrôles :</strong> Flèches ← ↑ →</p>
          <p><strong>Temps :</strong> 60 secondes</p>
        </div>
      )}
    </div>
  );
};

export default GameInfoButton;
