import React, { useEffect, useState } from 'react'
import axios from 'axios';
import CarteJeux from './CarteJeux';

export default function ListeJeux() {
    let url = "http://localhost:3001/api/jeux";
    const [jeux, setJeux] = useState([]);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const fetchJeux = () => {
            axios.get(url)
              .then(res => {
                setJeux(res.data);
              })
              .catch(err => console.error(err));
          };
        fetchJeux();
    }, [jeux]);

  return (
    <div>
      ListeJeux
      <div className='liste-jeux'>
          {jeux.map( (jeu,i) =>
              <div className='cartes-jeux'>
                  <CarteJeux idJ={i+1}/>
              </div>
          )}
      </div>
    </div>
  )
}
