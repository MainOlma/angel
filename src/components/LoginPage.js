import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

import routes from '../constants/routes';
import { db } from '../lib/firebase';
import logo from '../img/logo.svg';

// TODO: показывать ошибку при логине
// TODO: показывать лоадер при запросе

export default function LoginPage(props) {
    const mailRef = useRef(null);
    const passRef = useRef(null);

   const onSumbitForm = event => {
        event.preventDefault();
        event.stopPropagation();

        db.auth().signInWithEmailAndPassword(mailRef.current.value, passRef.current.value)
            .then(() => { window.location.href = routes.baseUrl() + routes.RECIPE_URL; })
            .catch((err) => {});
    };

    return (
        <div className='login-page'>
            <img
                className='login-page-logo'
                src={logo}
            />
            <div>Хей гайз 🤚 </div>
            <div>Чтобы войти, введи почту и пароль</div>

            <form className='login-page-form' onSubmit={onSumbitForm}>
                <div className='input-container username'>
                    <input ref={mailRef} type='email' placeholder='почта'></input>
                </div>
                <div className='input-container password'>
                    <input ref={passRef} type='password' placeholder='пароль'></input>
                </div>
                <div className='input-container submit'>
                    <input type='submit' value='Поехали!'></input>
                </div>
            </form>

            <div className='login-page-note'>
                Сервис работает только для своих.<br/>
                Если вы свой, но забыли пароль, напишите в телеграм @elizabeth_chuchulintseva.
            </div>
        </div>
    );
}
