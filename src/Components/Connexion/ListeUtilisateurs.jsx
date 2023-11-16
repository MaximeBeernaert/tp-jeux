import React, { useEffect, useState }  from 'react'
import axios from 'axios';

export default function ListeUtilisateurs() {
    const [utilisateurs, setUtilisateurs] = useState([]);
    let url = "http://localhost:3001/api/utilisateurs/";

    useEffect(() => {
        const fetchUsers= () => {
            axios.get(url)
              .then(res => {
                setUtilisateurs(res.data);
              })
              .catch(err => console.error(err));
          };
        fetchUsers();
      }, [url]);

  return (
    <div className='liste-utilisateurs'>
        Utilisateurs existants : 
        {utilisateurs.map(
          (utilisateur,i) => 
            <div className='liste-utilisateurs-utilisateur'>
                <div className='liste-utilisateurs-utilisateur-nom'>
                    {utilisateur.nomU}
                </div>
                <div className='liste-utilisateurs-utilisateur-prenom'>
                    {utilisateur.prenomU}
                </div>
                <div className='liste-utilisateurs-utilisateur-email'>
                    {utilisateur.emailU}
                </div>
                <div className='liste-utilisateurs-utilisateur-delete'>
                    <input type="button" value="Supprimer" onClick={() => {
                        axios.delete(url + 'delete/' + utilisateur.idU)
                          .then(res => {
                            window.location.href = "/users";

                          })
                          .catch(err => console.error(err));
                    }}/>
                </div>
            </div>
        )}
    </div>
  )
}
