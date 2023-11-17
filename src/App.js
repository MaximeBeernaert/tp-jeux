import { Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './Components/Body/Header';
import Footer from './Components/Body/Footer';
import MainMenu from './Components/Body/MainMenu';

import ConnexionUtilisateur from './Components/Connexion/ConnexionUtilisateur';
import CreationUtilisateur from './Components/Connexion/CreationUtilisateur';
import ListeUtilisateurs from './Components/Connexion/ListeUtilisateurs';
import ListeJeux from './Components/Jeux/ListeJeux';
import Card from './Components/Card/Card';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';


function App() {
  

  const theme = createTheme({
    palette: {
      primary: {
        main: '#004d40',
        light: '#39796b',
        dark: '#00251a',
      },
      secondary: {
        main: '#ffb300',
      },
    }
  });

  return (

    <ThemeProvider theme={theme}>
<div className="App">
      {/* HEADER QUI SERA MIS SUR TOUTES LES PAGES */}
      <Header/>
      
      {/* ROUTES */}
      <Routes>
          {/* LA PAGE PRINCIPALE */}
          <Route path="/" element={<MainMenu/>} />

          {/* CONNEXION / INSCRIPTION */}
          <Route path="/login" element={<ConnexionUtilisateur/>} />
          <Route path="/signin" element={<CreationUtilisateur/>} />

          {/* VOIR LES UTILISATEURS (MENU ADMIN, à retirer en production) */}
          <Route path="/users" element={<ListeUtilisateurs/>} />

          {/* LISTE DES JEUX */}
          <Route path="/gamelist" element={<ListeJeux/>} />

          {/* PANIER */}
          <Route path="/card" element={<Card/>} />
      </Routes>
      

      {/* FOOTER QUI SERA MIS SUR TOUTES LES PAGES */}
      <Footer/>
    </div>
    </ThemeProvider>
    
  );
}

export default App;
