import React, { useEffect, useState } from 'react'
import axios from 'axios';
import CarteJeux from '../Jeux/CarteJeux';
import { Box } from '@mui/material';

export default function MainMenu() {

  let url = "http://localhost:3001/api/";
  const [jeuxRecents, setJeuxRecents] = useState([]);
  const [jeuxNotes, setJeuxNotes] = useState([]);
  const [jeuxVentes, setJeuxVentes] = useState([]);

  useEffect(() => {
    axios.get(url+"recent")
      .then(res => {
        setJeuxRecents(res.data);
      })
      .catch(err => console.error(err));
    axios.get(url+"mostrented")
      .then(res1 => {
        
        setJeuxVentes(res1.data);
      })
      .catch(err => console.error(err));
    axios.get(url+"bestgames")
      .then(res2 => {
        setJeuxNotes(res2.data);
      })
      .catch(err => console.error(err));
  }, [jeuxRecents, jeuxVentes, jeuxNotes]);

    return (
      
    <div className='main-page'>
        <Box className='main-page-categorie main-page-tendance' name="lastgames" id="lastgames" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}}>
          <div className='main-page-categorie-titre main-page-tendance-titre' >
            Tendances
          </div>
          <div className='main-page-categorie-desc main-page-tendance-desc'>
            Découvrez les jeux les plus tendance 
          </div>
          <div className='main-page-categorie-list main-page-tendance-list'>
            {jeuxRecents != [] 
            ?
              jeuxRecents.map( (jeu,i) =>
              <CarteJeux idJ={jeu.idJ}/>
              )
            :
              <div className='main-page-categorie-list-text'>
                  Pas de jeux récents
              </div>
            }  
          </div>
        </Box>

        <Box className='main-page-categorie main-page-note' name="bestrates" id="bestrates" sx={{ bgcolor: 'primary.main', color: 'primary.dark'}}>
          <div className='main-page-categorie-titre main-page-note-titre'>
            Meilleurs notes
          </div>
          <div className='main-page-categorie-desc main-page-note-desc'>
            Les jeux les mieux notés
          </div>
          <div className='main-page-categorie-list main-page-note-list'>
            {jeuxNotes.length !== 0
            ?
              jeuxNotes.map( (jeu,i) =>
                <CarteJeux idJ={jeu.idJ}/>
              )
            :
              <div className='main-page-categorie-list-text'>
                  Pas de jeux notés
              </div>
            }
          </div>
        </Box>

        <Box className='main-page-categorie main-page-ventes' name="bestsales" id="bestsales" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}}>
          <div className='main-page-categorie-titre main-page-ventes-titre'>
            Meilleures ventes
          </div>
          <div className='main-page-categorie-desc main-page-ventes-desc'>
            Les jeux les plus loués du moment
          </div>
          <div className='main-page-categorie-list main-page-ventes-list'>
            {jeuxVentes.length !== 0 
            ?
            
              jeuxVentes.map( (jeu,i) =>

                <CarteJeux idJ={jeu}/>
              )
            :
              <div className='main-page-categorie-list-text'>
                  Pas de meilleures ventes
              </div>
            }
          </div>
        </Box>
    </div>
  )
}
