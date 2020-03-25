import React from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes';
import { db } from '../lib/firebase';

const onLogOutClick = (e) => {
    if (window.confirm(`Вы уверены что хотите выйти?`)) {
        db.auth().signOut()
            .then(() => {})
            .catch(() => {});
    }
    else e.preventDefault();
};

const Footer = () => {
    return (
        <div className='footer'>
            <Link
                className='footer-rules-link'
                to={routes.RULES_URL}
            >
                Правила и безопасность
            </Link>
            <Link
                className='footer-logout'
                to='/'
                onClick={onLogOutClick}
            >🚪</Link>
        </div>
    )
};

export default Footer;
