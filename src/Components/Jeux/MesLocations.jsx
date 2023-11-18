import React, { useEffect, useState }from 'react'
import MaRecherche from '../Recherche/MaRecherche'

import axios from 'axios'
import CarteJeux from './CarteJeux'

export default function MesLocations() {

  const [locations, setLocations] = useState([])

  useEffect(() => {
    const getLocationsForCurrentUser = async () => {
      const idU = localStorage.getItem('user');
      try {
        const response = await axios.get(`http://localhost:3001/api/locations/user/${idU}`);
        setLocations(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    getLocationsForCurrentUser()
  }, [locations])

  return (
    <div className='main-page'>
      <div className='location-titre'>
        Mes Locations
      </div>
        <MaRecherche/>
        <div className='main-page-game-list'>
          {locations.map( (jeu,i) =>
              <div className='cartes-jeux'>
                  <CarteJeux idJ={jeu.idJ}/>
              </div>
          )}
      </div>
    </div>
  )
}
