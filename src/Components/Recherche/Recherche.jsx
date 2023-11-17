import React, { useEffect, useState } from 'react'
import {useLocation} from "react-router-dom";
import axios from 'axios';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import CarteJeux from '../Jeux/CarteJeux';

export default function Recherche() {
    const { hash } = useLocation();
    const [recherche, setRecherche] = useState(hash.substring(1));
    const [jeux, setJeux] = useState([]);
    const [listeJeux, setListeJeux] = useState([{}]);

    let urlRecherche = "http://localhost:3001/api/jeux/search/";
    let urlListeJeux = "http://localhost:3001/api/jeux";

    useEffect(() => {
        const fetchJeux= () => {
            axios.get(urlRecherche+recherche)
              .then(res => {
                setJeux(res.data);
              })
              .catch(err => console.error(err));
              axios.get(urlListeJeux)
                  .then(res => {
                    setListeJeux(res.data);
                  })
                  .catch(err => console.error(err));
          };
        fetchJeux();
        
      }, [jeux, listeJeux]);


    

    
  return (
    <div className='search-page'>
        <div className='search-page-bar'>
          <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
            <TextField id="outlined-basic" label="Recherche" variant="outlined" value={recherche} onChange={e=>setRecherche(e.target.value)} autoFocus/>
          </Box>  
        </div>
        <>
        {recherche!== '' ?
            <div className='main-page-categorie'>
                <div className='main-page-categorie-list search-page-list'>
                    {jeux.map( (jeu,i) =>
                        <div className='cartes-jeux'>
                            <CarteJeux idJ={jeu.idJ}/>
                        </div>
                     )}
                </div>
            </div>
        :
            <div className='main-page-categorie'>
                <div className='main-page-categorie-list search-page-list'>
                    {/* {listeJeuxFunction()} */}
                    {listeJeux.map( (jeu,i) =>
                        <div className='cartes-jeux'>
                            <CarteJeux idJ={jeu.idJ}/>
                        </div>
                     )}
                </div>
            </div>
        }
        </>
    </div>
  )
}
