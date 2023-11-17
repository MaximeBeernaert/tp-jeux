import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';

export default function Panier() {
  const [gameInCard, setgameInCard] = useState([]);
  const url = "http://localhost:3001/api/jeux/";

  useEffect(() => {
    const card = JSON.parse(localStorage.getItem('card')) || [];
    const requests = card.map(jeu => axios.get(url + jeu.idJ));
    
    Promise.all(requests)
      .then(results => {
        const jeux = results.map(res => res.data[0]);
        setgameInCard(jeux);
      })
      .catch(err => console.error(err));
  }, []);

  const removeFromCard = (idJ) => {
    let card = JSON.parse(localStorage.getItem('card')) || [];
    card = card.filter(jeu => jeu.idJ !== idJ);
    localStorage.setItem('card', JSON.stringify(card));
    setgameInCard(gameInCard.filter(jeu => jeu.idJ !== idJ));
  }

  return (
    <div className='card'>
      {gameInCard.length > 0 ? (
        gameInCard.map((jeu, index) => (
          <div key={index} className='game-in-card'>
            <div>{jeu.titreJ}</div>
            <div>{jeu.prixJ + " €"}</div>
            <Button 
              variant="outlined" 
              color="error" 
              size="small"
              onClick={() => removeFromCard(jeu.idJ)}
            >
              Retirer
            </Button>
          </div>
        ))
      ) : (
        <div>Panier vide</div>
      )}
    </div>
  );
}
