import { Routes, Route } from 'react-router-dom';

import './App.css';

import Header from './Components/Body/Header';
import Footer from './Components/Body/Footer';
import MenuNonConnecte from './Components/Body/MenuNonConnecte';


function App() {
  return (
    <div className="App">
      {/* HEADER QUI SERA MIS SUR TOUTES LES PAGES */}
      <Header/>

      {/* ROUTES */}
      <Routes>
          {/* LA PAGE PRINCIPALE */}
          <Route path="/" element={<MenuNonConnecte/>} />
      </Routes>
      

      {/* FOOTER QUI SERA MIS SUR TOUTES LES PAGES */}
      <Footer/>
    </div>
  );
}

export default App;
