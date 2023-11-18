import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Tooltip, Alert, TextField, Snackbar, Modal, Box, Typography, Rating } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format } from 'date-fns';

export default function CarteJeux({ idJ }) {

  const url = "http://localhost:3001/api/jeux/";
  
  //Game details
  const [jeux, setJeux] = useState({});
  const [isAvailable, setIsAvailable] = useState(false);

  //User connection
  const [isUserConnected, setIsUserConnected] = useState(false);
  //Rent date
  const empruntL = useState(new Date()); //Today
  const [renduL, setRenduL] = useState(null); //Selected date by user

  //Calendars display
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // Modal display
  const [openModal, setOpenModal] = useState(false);

  //Get if the current iser have already rent this game
  const [locations, setLocations] = useState([]);
  const [isAlreadyRent, setIsAlreadyRent] = useState(false);

  //User feedback
  const [noteL, setNoteL] = React.useState(5);
  const [commentL, setCommentL] = React.useState('');

  const img = jeux.urlJ;

  useEffect(() => {
    setIsUserConnected(localStorage.getItem('user') !== null);

    axios.get(url + idJ)
      .then(res => {
        setJeux(res.data[0]);
        checkIfAvailable(res.data[0]);
        getLocationsForCurrentUser();
      })
      .catch(err => console.error(err));
  }, [idJ, locations]);

  //Check if game is already in card
  const checkIfAvailable = (jeu) => {
    const card = JSON.parse(localStorage.getItem('card')) || [];
    const isInCard = card.some(j => j.idJ === jeu.idJ);
    setIsAvailable(!isInCard);
  }

  //Add game to card
  const addToCard = (itemToAdd) => {
    const card = JSON.parse(localStorage.getItem('card')) || [];
    card.push(itemToAdd);
    localStorage.setItem('card', JSON.stringify(card));
    setIsAvailable(false);
  }

  //Confirm date and add game to card when user click on calendar
  const confirmDateAndAddToCard = () => {

    if (selectedDate) {
      // Formater la date sélectionnée pour renduL
      const formattedRenduL = format(selectedDate.toDate(), 'yyyy-MM-dd');

      // Formater la date actuelle pour empruntL
      const formattedEmpruntL = format(new Date(), 'yyyy-MM-dd');

      const itemToAdd = {
        idJ: jeux.idJ,
        renduL: formattedRenduL,
        empruntL: formattedEmpruntL
      };
  
      addToCard(itemToAdd);
      setShowCalendar(false);
      setOpenSnackbar(true);
    } else {
      alert("Veuillez choisir une date de rendu.");
    }
  }

  //Get locations for current user
  const getLocationsForCurrentUser = async () => {
    const idU = localStorage.getItem('user');
    try {
      const response = await axios.get(`http://localhost:3001/api/locations/user/${idU}`);
      setLocations(response.data);
    } catch (error) {
      console.error(error);
    }

    //Check if current user have already rent this game
    const isAlreadyRent = locations.some(l => l.idJ === jeux.idJ);
    setIsAlreadyRent(isAlreadyRent);
  };

  //Stop rent for the current game
  const stopRent = async (idL) => {
    try {
      const response = await axios.delete(`http://localhost:3001/api/locations/delete/${idL}`);
    }
    catch (error) {
      console.error(error);
    }
  }

  //Display calendar when user click on rent button
  const handleRentClick = () => {
    setShowCalendar(true);
  }

  //Close calendar when user click on cancel button
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  // Afficher la modal avec les détails du jeu
  const handleShowDetails = () => {
    setOpenModal(true);
  };
  
  // Fermer la modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  //Publish user feedback
  const publishFeedback = async (idL, noteL, commentL) => {
    try {
      const reponse = await axios.put(`http://localhost:3001/api/locations/update/${idL}`)
    }
    catch (error) {
      console.error(error);
    }
  }

  //Redirect to game details page
  const handleClick = (idJ) => {
    window.location.href = `/gamedetails/${idJ}`;
  }

  return (
    <div className='carte-jeux' key={jeux.idJ} onClick={() => handleClick(jeux.idJ)}>
      <div className='carte-jeux-items'>
        <div className='carte-jeux-img' >
            <div className='image-spec' >
              <img className='img' src={jeux.imgJ} alt={jeux.titreJ} />
            </div>
        </div>        
        <Box className='carte-jeux-text' sx ={{bgcolor:'secondary.main'}}>
          {/* Détails du jeu */}
          <div className='carte-jeux-titre'>
            {jeux.titreJ}
          </div>
          <div className='carte-jeux-prix'>
            {jeux.prixJ + " €/j"}
          </div>
        </Box>
      </div>
      
      
        {/* Modal pour afficher les détails du jeu */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div className='carte-jeux-modal'>
            <Box className='carte-jeux-modal-child'>
              {/* DISPLAY GAME INFOS */}
              <div className='carte-jeux-modal-box'>
                  <div className='carte-jeux-modal-titre'>
                    {jeux.titreJ}
                  </div>
                  <div className='carte-jeux-modal-editeur'>
                    {jeux.editeurJ}
                  </div>
                  <div className='carte-jeux-modal-anne'>
                    {jeux.anneJ}
                  </div>
                  <div className='carte-jeux-modal-desc'>
                    {jeux.descJ}
                  </div>
              </div>

              {/* USER HAVE RENT OR NOT */}
              {!isAlreadyRent ? (
                  <div className='carte-jeux-modal-actions'>
                    <div className='carte-jeux-modal-actions-prix'>
                      {jeux.prixJ + " € par jour"}
                    </div>
                  <div className='carte-jeux-modal-actions-louer'>
                    <span>
                      {/* Calendrier pour choisir une date */}
                        <div className='carte-jeux-emprunt' title='Date de rendu'>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                              label="Date de rendu"
                              disablePast={true}
                              value={selectedDate} 
                              onChange={(newDate) => setSelectedDate(newDate)}
                              renderInput={(params) => <TextField {...params} />}
                            />
                          </LocalizationProvider>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small"
                        onClick={confirmDateAndAddToCard}
                      >
                        Ajouter au panier
                      </Button>
                    </div>
                  </span>
                </div>
              </div>     
              ) : ( 
                <>
                  <div className='carte-jeux-modal-actions'>
                    {/* Note de la location */}
                    <Box 
                      sx={{
                        '& > legend': { mt: 2 },
                      }}
                    >
                      <Typography component="legend">Votre note :</Typography>
                      <Rating
                        required
                        name="noteL"
                        value={noteL}
                        onChange={(event, newValue) => {
                          setNoteL(newValue);
                        }}
                      />
                    </Box>
                    
                  {/* Avis de la location */}
                  <Box
                    component="form"
                    sx={{
                      '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                  >
                    <div>
                      <TextField
                        required
                        id="commentL"
                        label="Votre avis"
                        multiline
                        rows={6}
                      />
                    </div>
                  </Box>

                  {/* Bouton pour envoyé l'avis */}
                  <Button
                    variant="outlined"
                    color="success"
                    size="small"
                    onClick={publishFeedback(locations.find(l => l.idJ === jeux.idJ).idL, noteL, commentL)}
                    >
                    Envoyer votre avis
                  </Button>

                  {/* Bouton pour arrêter la location */}
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => stopRent(locations.find(l => l.idJ === jeux.idJ).idL)}
                  >
                    Arrêter la location
                  </Button>
                </div>
                </>
              )}
            </Box>
          </div>
        </Modal>

        {/* Snackbar pour la notification */}
        <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Jeu ajouté au panier avec succes !
          </Alert>
        </Snackbar>
      </div>
  );
}
