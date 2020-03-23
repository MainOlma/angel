import React, { useState, useEffect }  from "react";
import Logo from "../img/logo.svg";
import Auth from "./Auth";
import {Link} from "react-router-dom";
import routes from '../constants/routes';
import { db } from '../lib/firebase';

export default function LoginPage(props) {
    const [user, setUser] = useState(false)
    db.auth().onAuthStateChanged(function (user) {
        if (user) { setUser(user)} else setUser(false)});
    return (
        <div className='greetings'>
            <img src={Logo} width={291} height={109}/>
            <h3>Хей гайз 🤚 </h3>
            <h3>Чтобы войти, введи пароль</h3>
            <Auth/>
            {
                user &&

                <div>
                    <Link to={`${routes.baseUrl()}${routes.RECIPE_URL}`}>Рецепты</Link><br/>
                    <Link to={`${routes.baseUrl()}${routes.RULES_URL}`}>Правила</Link>
                </div>
            }

        </div>
    )

}
