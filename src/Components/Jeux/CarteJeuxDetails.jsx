import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Alert, TextField, Snackbar, Box, Typography, Rating } from '@mui/material';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';

import './CarteJeuxDetails.css';

export default function CarteJeuxDetails() {

    //URL
    const baseUrl = "http://localhost:3001/api";

    //Get game details
    const [jeux, setJeux] = useState({});

    //Get id from URL
    const { idJ } = useParams();

    //Get if user is connected
    const [isUserConnected, setIsUserConnected] = useState(false);

    //Get if game is already in card
    const [isAvailable, setIsAvailable] = useState(false);

    //Get if game is already rent by user
    const [isAlreadyRent, setIsAlreadyRent] = useState(false);

    //Get locations for current user
    const [locations, setLocations] = useState([]);

    //Rent calendar
    const [showRentOptions, setShowRentOptions] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    //Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false);

    //User feedback
    const [noteL, setNoteL] = useState(5);
    const [commentL, setCommentL] = useState('');
    const [feedbacks, setFeedbacks] = useState([]);

    //Get game from BDD
    useEffect(() => {
        // Vérifier si l'utilisateur est connecté
        setIsUserConnected(localStorage.getItem('user') !== null);

        // Récupérer les détails du jeu depuis la BDD
        axios.get(`${baseUrl}/jeux/${idJ}`)
            .then(res => {
                setJeux(res.data[0]); // Définir les détails du jeu
                checkIfAvailable(res.data[0]); // Vérifier si le jeu est déjà dans le panier
                getLocationsForCurrentUser(); // Récupére les locations pour l'utilisateur actuel
                fetchFeedbacks(idJ); // Récupérer les feedbacks pour ce jeu
            })
            .catch(err => console.error(err));
    }, [idJ]);

    //Check if game is already in card
    const checkIfAvailable = (jeu) => {
    const card = JSON.parse(localStorage.getItem('card')) || [];
    const isInCard = card.some(j => j.idJ === jeu.idJ);
    setIsAvailable(!isInCard);
    }

    //Check if game is already rent by user
    const getLocationsForCurrentUser = async () => {
        const idU = localStorage.getItem('user');
        try {
            const response = await axios.get(`${baseUrl}/locations/user/${idU}`);
            setLocations(response.data);
            console.log(response.data);
            //Check if repsonse.data contains the current game
            const rent = response.data.some(l => l.idJ === jeux.idJ);
            setIsAlreadyRent(rent);
        } catch (error) {
        console.error(error)
        }
    };

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
            price: jeux.prixJ,
            renduL: formattedRenduL,
            empruntL: formattedEmpruntL
        };
    
        addToCard(itemToAdd);
        setShowRentOptions(false);
        setOpenSnackbar(true);
        } else {
        alert("Veuillez choisir une date de rendu.");
        }
    }

    //Close snackbar
    const handleCloseSnackbar = () => {
        setTimeout(() => {
            setOpenSnackbar(false);
        }, 4000);
    };

    //Handle change for feedback comment
    const handleChange = (event) => {
        setCommentL(event.target.value);
    };

    //Disable submit button if comment is empty
    const commentIsEmpty = noteL === null || noteL === 0 || commentL.trim() === '';

    //Publish feedback
    const publishFeedback = (idL, noteL, commentL) => {
        try {
                axios.put(`http://localhost:3001/api/locations/update/${idL}`, {
                noteL: noteL,
                commentL: commentL
            });
        } catch (error) {
            console.error(error);
        }
    }

    //Get feedbacks for current game
    const fetchFeedbacks = (idJ) => {
        axios.get(`${baseUrl}/feedbacks/${idJ}`)
            .then(res => {
                setFeedbacks(res.data);
            })
            .catch(err => {
                console.error(err);
            });
    };

    //Stop rent for the current game
    const stopRent = async (idL) => {
        try {
            const reponse = await axios.delete(`http://localhost:3001/api/locations/delete/${idL}`);

            if (reponse.status === 200) {
                setIsAlreadyRent(false);
            }
        }
        catch (error) {
        console.error(error);
        }
    }

  return (
    <div className='jeux-details-container'>
        <div className='jeux-details-infos'>

            <div className='jeux-details-infos-image card'>
                IMAGE (TODO)
            </div>

            <div className='jeux-details-infos-text card'>
                <div className='jeux-details-infos-text-titre'>
                    {jeux.titreJ}
                </div>
                <div className='jeux-details-infos-text-editeur'>
                    {jeux.editeurJ}
                </div>
                <div className='jeux-details-infos-text-description'>
                    {jeux.descJ}
                </div>
                <div className='jeux-details-infos-text-prix'>
                    {jeux.prixJ + " € par jours"}
                </div>

                {/* SI CO && SI CARD && SI RENT */}
                <div className='jeux-details-infos-rent'>
                    {isUserConnected && isAlreadyRent ? (
                        // Si l'utilisateur est connecté et a déjà loué le jeu, montrez le bouton pour arrêter la location
                        <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => stopRent(locations.find(l => l.idJ === jeux.idJ).idL)}
                        >
                        Arrêter la location
                        </Button>
                    ) : (
                        // Sinon, montrez le bouton pour louer le jeu (ou indiquez que le jeu est dans le panier ou qu'il faut se connecter)
                        <Button
                        variant="contained"
                        disabled={!isUserConnected || !isAvailable || isAlreadyRent}
                        color="primary"
                        onClick={() => setShowRentOptions(!isUserConnected || isAvailable ? true : false)}
                        >
                        {isUserConnected ? (
                            isAvailable ? (
                            "Louer"
                            ) : (
                            "Jeu déjà dans le panier"
                            )
                        ) : (
                            "Connectez-vous pour louer"
                        )}
                        </Button>
                    )}

                    {showRentOptions && (
                        <div className='carte-jeux-infos-rent-date'>
                            <div className='carte-jeux-infos-rent-date-calendar' title='Date de rendu'>
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
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className='jeux-details-feedback card'>

            {isUserConnected && isAlreadyRent && (
                <div className='jeux-details-feedback-form'>
                    Donnez votre avis sur ce jeu !
                    <div className='jeux-details-feedback-form-note'>
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
                    </div>
                    <div className='jeux-details-feedback-form-comment'>
                        {/* Avis de la location */}
                        <Box
                            component="form"
                            sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            }}
                        >
                            <TextField
                                required
                                id="commentL"
                                label="Votre avis"
                                multiline
                                rows={10}
                                value={commentL}
                                onChange={handleChange}
                            />
                        </Box>
                    </div>
                    <div className='jeux-details-feedback-form-button'>
                        {/* Bouton pour envoyé l'avis */}
                        <Button
                            variant="outlined"
                            color="success"
                            size="small"
                            disabled={commentIsEmpty}
                            onClick={() => publishFeedback(locations.find(l => l.idJ === jeux.idJ).idL, noteL, commentL)}
                        >
                            Envoyer
                        </Button>
                    </div>
                </div>
            )}

            <div className='jeux-details-feedback-comment'>
                <Typography variant="h6">Avis des utilisateurs :</Typography>
                {feedbacks.length > 0 ? (
                feedbacks.map((feedback, index) => (
                    <div key={index} className='feedback-item'>
                    <Typography variant="subtitle1">{feedback.nomU} {feedback.prenomU}</Typography>
                    <Typography variant="body2">{feedback.commentL}</Typography>
                    <Rating name="read-only" value={feedback.noteL} readOnly />
                    </div>
                ))
                ) : (
                <Typography>Aucun avis pour le moment.</Typography>
                )}
            </div>
        </div>

        {/* Snackbar pour la notification */}
        <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Jeu ajouté au panier avec succes !
          </Alert>
        </Snackbar>
    </div>
  )
}
