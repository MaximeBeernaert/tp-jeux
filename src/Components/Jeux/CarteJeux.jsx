import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Tooltip } from '@mui/material';

export default function CarteJeux({ idJ }) {
  const url = "http://localhost:3001/api/jeux/";
  const [jeux, setJeux] = useState({});
  const [isAvailable, setIsAvailable] = useState(false);
  const [isUserConnected, setIsUserConnected] = useState(false);

  useEffect(() => {
    setIsUserConnected(localStorage.getItem('user') !== null);

    axios.get(url + idJ)
      .then(res => {
        setJeux(res.data[0]);
        checkIfAvailable(res.data[0]);
      })
      .catch(err => console.error(err));
  }, [idJ]);

  const checkIfAvailable = (jeu) => {
    const card = JSON.parse(localStorage.getItem('card')) || [];
    const isInCard = card.some(j => j.idJ === jeu.idJ);
    setIsAvailable(!isInCard);
  }

  const addToCard = (idJ) => {
    const card = JSON.parse(localStorage.getItem('card')) || [];
    if (!card.some(jeux => jeux.idJ === idJ)) {
      card.push({ idJ });
      localStorage.setItem('card', JSON.stringify(card));
      setIsAvailable(false);
    }
  }

  return (
    <div className='carte-jeux'>
      <div className='carte-jeux-items'>
        {/* Détails du jeu */}
        <div className='carte-jeux-titre'>
          {jeux.titreJ}
        </div>
        <div className='carte-jeux-editeur'>
          {jeux.editeurJ}
        </div>
        <div className='carte-jeux-anne'>
          {jeux.anneJ}
        </div>
        <div className='carte-jeux-desc'>
          {jeux.descJ}
        </div>
        <div className='carte-jeux-prix'>
          {jeux.prixJ + " €"}
        </div>
        {/* Bouton Louer avec logique conditionnelle */}
        <Tooltip 
          title={!isUserConnected ? "Vous devez être connecté pour louer un jeu" : 
                !isAvailable ? "Déjà dans le panier" : ""}
          disableHoverListener={isUserConnected && isAvailable}
        >
          <span> {/* Span nécessaire pour Tooltip avec Button désactivé */}
            <Button 
              variant="outlined" 
              color="success" 
              size="small" 
              onClick={() => addToCard(jeux.idJ)}
              disabled={!isUserConnected || !isAvailable}
            >
              Louer
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
}
