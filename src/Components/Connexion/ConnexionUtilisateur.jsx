import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function ConnexionUtilisateur() {
    let url = "http://localhost:3001/api/utilisateurs/connexion/";

  return (
    <div className='connexion-utilisateur'>
        ConnexionUtilisateur
        <form className='connexion-utilisateur-form' method="POST" onSubmit={ (e) => { 
            e.preventDefault();
            let params = document.getElementById("connexion-utilisateur-form-email-input").value + "/" + document.getElementById("connexion-utilisateur-form-mdp-input").value;
            axios.get(url + params)
                .then(res => {
                    localStorage.setItem('user', JSON.stringify(res.data.user.idU))
                    window.location.href = "/";
                })  
                .catch(err => console.error(err))
            ;
        }}>
            <div className='connexion-utilisateur-form-email'>
                <label htmlFor='email'>Adresse mail</label>
                <input type='text' name='email' id='connexion-utilisateur-form-email-input' />
            </div>
            <div className='connexion-utilisateur-form-mdp'>
                <label htmlFor='mdp'>Mot de passe</label>
                <input type='password' name='mdp' id='connexion-utilisateur-form-mdp-input' />
            </div>
            <div className='connexion-utilisateur-form-submit'>
                <input type='submit' value='Se connecter' />
            </div>
        </form>
    </div>
  )
}
