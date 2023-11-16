import React, { useEffect, useState } from 'react'

import axios from 'axios';


export default function CarteJeux( {idJ} ) {
    //Load data from API with id of the game
    let url = "http://localhost:3001/api/jeux/";

    const [jeux, setJeux] = useState({});

    //Fetch data from API
    useEffect(() => {
        const fetchJeux = () => {
            axios.get(url + idJ)
              .then(res => {
                setJeux(res.data[0]);
              })
              .catch(err => console.error(err));
          };
        fetchJeux();
    }, [jeux]);



  return (
    <div className='carte-jeux'>
        <div className='carte-jeux-items'>
            {jeux.titreJ}
            {jeux.editeurJ}
            {jeux.anneJ}
            {jeux.descJ}
            {jeux.prixJ}
        </div>
    </div>
  )
}
