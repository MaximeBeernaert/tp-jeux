import React from 'react'

import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header>
        <div className='header-link'>
            <Link className="header-link-menu" to="/">Revenir au menu / logo</Link>
            <Link className="header-link-users" to="/users">Liste utilisateurs</Link>
            <Link className="header-link-login" to="/signin">Créer un compte</Link>
            <Link className="header-link-signin" to="/login">Se connecter</Link>
        </div>
    </header>
  )
}
