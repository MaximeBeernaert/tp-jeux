import React from 'react'

export default function DeconnexionUtilisateur() {
  return (
    <div>DeconnexionUtilisateur
        <input type="button" value="Deconnexion" onClick={() => {
                localStorage.removeItem("user");
                window.location.href = "/";
            }
        } />
    </div>
  )
}
