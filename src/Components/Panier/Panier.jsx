import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { format, differenceInCalendarDays } from 'date-fns';
// ... autres imports nécessaires

export default function Panier() {
  const [jeuxDansPanier, setJeuxDansPanier] = useState([]);
  const url = "http://localhost:3001/api/jeux/";

  useEffect(() => {
    // Get card from local storage
    const card = JSON.parse(localStorage.getItem('card')) || [];

    // Get all games from card and add them to the state
    const requests = card.map(jeux => axios.get(url + jeux.idJ).then(res => ({
      ...res.data[0],
      renduL: jeux.renduL,
      empruntL: jeux.empruntL

    })));
    
    Promise.all(requests)
      .then(results => {
        setJeuxDansPanier(results);
      })
      .catch(err => console.error(err));
  }, []);

  // Remove a game from the card
  const removeFromCard = (idJ) => {
    let card = JSON.parse(localStorage.getItem('card')) || [];
    card = card.filter(jeux => jeux.idJ !== idJ);
    localStorage.setItem('card', JSON.stringify(card));
    setJeuxDansPanier(jeuxDansPanier.filter(jeux => jeux.idJ !== idJ));
  }

  // Calculate lenght of the rent
  const calculerNombreDeJours = (debut, fin) => {
    const dateDebut = new Date(debut);
    const dateFin = new Date(fin);
    return differenceInCalendarDays(dateFin, dateDebut);
  };

  // Total price
  const calculerTotalAPayer = () => {
    return jeuxDansPanier.reduce((total, jeu) => {
      const joursDeLocation = calculerNombreDeJours(jeu.empruntL, jeu.renduL);
      return total + (joursDeLocation * jeu.prixJ);
    }, 0);
  };
  

  return (
    <div className='main-page panier'>
     
      {jeuxDansPanier.length > 0 ? (
        <>
         <div className='main-page-game-list'>
        {jeuxDansPanier.map((jeux, index) => (
          <div key={index} className='jeux-dans-panier'>
            <div>{jeux.titreJ}</div>
            <div>{jeux.prixJ + " €"}</div>
            <div className='jeux-dans-panier-date'>              
              Date de Location : {format(new Date(jeux.empruntL), "d MMMM yyyy")} au {format(new Date(jeux.renduL), "d MMMM yyyy")}, soit {calculerNombreDeJours(jeux.empruntL, jeux.renduL)} jours de location
            </div>
            <div className='jeux-dans-panier-prix'>
              Pour {calculerNombreDeJours(jeux.empruntL, jeux.renduL)} jours de location vous allez payer : {calculerNombreDeJours(jeux.empruntL, jeux.renduL) * jeux.prixJ} €
            </div>
            <div className='jeux-dans-panier-remove'>
              <Button
                variant="outlined" 
                color="error" 
                size="small"
                onClick={() => removeFromCard(jeux.idJ)}
              >
                Retirer
              </Button>
            </div>
          </div>
        ))}
      </div>
      Total à payer : {calculerTotalAPayer()} €
        <div className='panier-confirmation'>
          <Button 
            variant="contained" 
            color="success" 
            size="large"
            onClick={() => {
              // Envoi du panier au serveur pour chaque jeux dans le panier
              jeuxDansPanier.forEach(jeux => {
                axios.post("http://localhost:3001/api/locations/create", {
                  idU: localStorage.getItem('user'),
                  idJ: jeux.idJ,
                  empruntL: jeux.empruntL,
                  renduL: jeux.renduL
                })
                  .then(res => {
                    console.log(res);
                  })
                  .catch(err => console.error(err));
              });
              // Suppression du panier
              localStorage.removeItem('card');

              // Redirection 
              window.location.href = '/mygames';
            
            }}
          >
            Confirmer votre panier
          </Button>
        </div>
        </>
      ) : (
        <div className='empty-basket'>
            Votre panier est vide
            <br/>
          <Button className="header-link-button header-link-menu" href="/" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small">Retourner au magasin</Button>

        </div>
      )}
    </div>
  );
}
