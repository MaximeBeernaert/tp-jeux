import { Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './Components/Body/Header';
import Footer from './Components/Body/Footer';
import MenuNonConnecte from './Components/Body/MenuNonConnecte';

import ConnexionUtilisateur from './Components/Connexion/ConnexionUtilisateur';
import CreationUtilisateur from './Components/Connexion/CreationUtilisateur';
import ListeUtilisateurs from './Components/Connexion/ListeUtilisateurs';
import ListeJeux from './Components/Jeux/ListeJeux';


function App() {
  return (
    <div className="App">
      {/* HEADER QUI SERA MIS SUR TOUTES LES PAGES */}
      <Header/>

      {/* ROUTES */}
      <Routes>
          {/* LA PAGE PRINCIPALE */}
          <Route path="/" element={<MenuNonConnecte/>} />

          {/* CONNEXION / INSCRIPTION */}
          <Route path="/login" element={<ConnexionUtilisateur/>} />
          <Route path="/signin" element={<CreationUtilisateur/>} />

          {/* VOIR LES UTILISATEURS (MENU ADMIN, à retirer en production) */}
          <Route path="/users" element={<ListeUtilisateurs/>} />

          {/* LISTE DES JEUX */}
          <Route path="/gamelist" element={<ListeJeux/>} />
      </Routes>
      

      {/* FOOTER QUI SERA MIS SUR TOUTES LES PAGES */}
      <Footer/>
    </div>
  );
}

export default App;
