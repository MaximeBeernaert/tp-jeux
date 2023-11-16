import React from 'react'
import axios from 'axios';


export default function CreationUtilisateur() {
  let url = "http://localhost:3001/api/utilisateurs/create";
  return (
    <div>
      CreationUtilisateur
      <div className='creation-utilisateur'>
        <form className='creation-utilsateur-form' method="POST" onSubmit={ (e) => {
            e.preventDefault()
            axios.post(url, 
                {
                  "nomU": document.getElementById("creation-utilisateur-form-nomU").value,
                  "prenomU": document.getElementById("creation-utilisateur-form-prenomU").value,
                  "mailU": document.getElementById("creation-utilisateur-form-emailU").value,
                  "mdpU": document.getElementById("creation-utilisateur-form-mdpU").value
                }
              ).then(res => {
                window.location.href = "/login";
              })
              .catch(err => console.error(err));
          }}>
            <div className='creation-utilisateur-form-nom'>
                <label htmlFor='nom'>Nom</label>
                <input id="creation-utilisateur-form-nomU" className='creation-utilisateur-form-nom-input' type='text' placeholder='Nom'/>
            </div>
            <div className='creation-utilisateur-form-prenom'>
                <label htmlFor='prenom'>Prenom</label>
                <input id="creation-utilisateur-form-prenomU" className='creation-utilisateur-form-prenom-input' type='text' placeholder='Prenom'/>
            </div>
            <div className='creation-utilisateur-form-email'>
                <label htmlFor='email'>Adresse mail</label>
                <input id="creation-utilisateur-form-emailU" className='creation-utilisateur-form-email-input' type='text' placeholder='Email'/>
            </div>
            <div className='creation-utilisateur-form-mdp'> 
                <label htmlFor='mdp'>Mot de passe</label>
                <input id="creation-utilisateur-form-mdpU" className='creation-utilisateur-form-mdp-input' type='text' placeholder='Mot de passe'/>
            </div>
            <div className='creation-utilisateur-form-submit'>
                <input className='creation-utilisateur-form-submit-input' type='submit' value='Créer un compte'/>
            </div>
        </form>
      </div>
    </div>
  )
}
