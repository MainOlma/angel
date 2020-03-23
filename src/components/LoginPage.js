import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import {Link} from 'react-router-dom';
import routes from '../constants/routes';
import { db } from '../lib/firebase';

// TODO: если есть юзер, то нужно сразу перенаправлять на страницу рецептов
// `${routes.baseUrl()}${routes.RECIPE_URL}`

export default function LoginPage(props) {
    const [user, setUser] = useState(false);

    db.auth().onAuthStateChanged((user) => {
        if (user) setUser(user);
        else setUser(false);
    });

    return (
        <div className='login-page'>
            <img
                className='login-page-logo'
                src={`${routes.baseUrl()}/img/logo.svg`}
            />
            <div>Хей гайз 🤚 </div>
            <div>Чтобы войти, введи почту и пароль</div>

            <Auth />

            <div className='login-page-note'>
                Сервис работает только для своих.<br/>
                Если вы свой, но забыли пароль, напишите в телеграм @ivan_dianov.
            </div>
        </div>
    )
}
