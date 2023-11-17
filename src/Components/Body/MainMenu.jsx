import React, { useEffect, useState } from 'react'
import axios from 'axios';
import CarteJeux from '../Jeux/CarteJeux';

export default function MenuNonConnecte() {

  let url = "http://localhost:3001/api/recent";
  const [jeuxRecents, setJeuxRecents] = useState([]);

  useEffect(() => {
      const fetchRecentGames = () => {
          axios.get(url)
            .then(res => {
              setJeuxRecents(res.data);
            })
            .catch(err => console.error(err));
        };
      fetchRecentGames();
  }, [jeuxRecents]);



    return (
    <div className='main-page'>
        <div className='main-page-categorie main-page-tendance' name="lastgames" id="lastgames">
          <div className='main-page-categorie-titre main-page-tendance-titre' >
            Tendances 
          </div>
          <div className='main-page-categorie-desc main-page-tendance-desc'>
            Découvrez les jeux les plus tendance du moment
          </div>
          <div className='main-page-categorie-list main-page-tendance-list'>
            {jeuxRecents.map( (jeu,i) =>{ 
              // console.log(jeu.idJ);
              <div className='cartes-jeux'>
                  <CarteJeux idJ={jeu.idJ}/>
              </div>
            })}
          </div>
          <div className='main-page-categorie-list main-page-ventes-list'>
            {/* gl div purement visuelle*/}
          </div>
        </div>

        <div className='main-page-categorie main-page-note' name="bestrates" id="bestrates">
          <div className='main-page-categorie-titre main-page-note-titre'>
            Meilleurs notes
          </div>
          <div className='main-page-categorie-desc main-page-note-desc'>
            Découvrez les jeux les mieux notés du moment
          </div>
          <div className='main-page-categorie-list main-page-note-list'>
            {/* gl */}
          </div>
          <div className='main-page-categorie-list main-page-ventes-list'>
            {/* gl div purement visuelle*/}
          </div>
        </div>

        <div className='main-page-categorie main-page-ventes' name="bestsales" id="bestsales">
          <div className='main-page-categorie-titre main-page-ventes-titre'>
            Meilleures ventes
          </div>
          <div className='main-page-categorie-desc main-page-ventes-desc'>
            Découvrez les jeux les plus loués du moment
          </div>
          <div className='main-page-categorie-list main-page-ventes-list'>
            {/* gl */}
          </div>
          <div className='main-page-categorie-list main-page-ventes-list'>
            {/* gl div purement visuelle*/}
          </div>
        </div>
    </div>
  )
}
