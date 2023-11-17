import React from 'react';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';

function Header() {

  const [isConnected, setIsConnected] = useState(false)
  let currentURL = window.location.href;

  useEffect(() => {
    // check if user is connected or not
    const checkConnection = () => {
      const user = localStorage.getItem('user')
      return user ? true : false // return true if user is connected
    }
    setIsConnected(checkConnection())
  }, []);

  const scrollSwitch = () => {
    switch (currentURL){
      case "http://localhost:3000/#lastgames":
        scrollToHash("lastgames");
        break;
      case "http://localhost:3000/#bestrates":
        scrollToHash("bestrates");
        break;
      case "http://localhost:3000/#bestsales":
        scrollToHash("bestsales");
        break;
    }
  }


  const scrollToHash = (hashName) => {         
    window.location.href = "http://localhost:3000/#" + hashName;     
  }

  return (
    <div className={(currentURL == "http://localhost:3000/" || currentURL == "http://localhost:3000/#lastgames" || currentURL == "http://localhost:3000/#bestsales" || currentURL == "http://localhost:3000/#bestrates") ? 'header-mainmenu' : 'header-othermenu'} >
      <div className='header-top'>
        <div className='header-div-split header-logo'>
          <Button className="header-link-button header-link-menu" href="/" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small">logo</Button>
        </div>
          <div className='header-div-split header-link'> 
              <Button className="header-link-button header-link-users" href="/users" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small">Utilisateurs</Button>
              <Button className="header-link-button header-link-lastgames" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small" onClick={() => {scrollToHash("lastgames")}}>Dernières sorties</Button>
              <Button className="header-link-button header-link-bestrates" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small" onClick={() => {scrollToHash("bestrates")}}>Meilleures notes</Button>
              <Button className="header-link-button header-link-bestsales" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small" onClick={() => {scrollToHash("bestsales")}}>Meilleures ventes</Button>
              <Button className="header-link-button header-link-support" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small">Support 24/7</Button>


          </div>
        <div className='header-div-split header-user'>
          {/* If user is connected */}
          {isConnected ? (
                <>
                <Button className="header-link-button header-link-card" href="/card" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small">Mon panier</Button>
                <Button className="header-link-button header-link-logout" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small"
                    onClick={() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("card");
                    window.location.href = "/";
                    }}
                >Se déconnecter</Button>
                </>
                ) : (
                  <>
                  <Button className="header-link-button header-link-login" href="/signin" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small">Créer un compte</Button>
                  <Button className="header-link-button header-link-signin" href="/login" sx={{ bgcolor: 'primary.light', color: 'primary.dark'}} size="small">Se connecter</Button>
                  </>
                )}
        </div>
      </div>
      <div className='header-search'>
          <Box component="form" sx={{'& > :not(style)': { m: 1, width: '25ch' }, }} noValidate autoComplete="off" >
            <TextField id="outlined-basic" label="Recherche" variant="outlined" />
          </Box>  
        </div>
        {scrollSwitch()}
    </div>
    
  )
}

export default Header