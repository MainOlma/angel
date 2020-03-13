import React, { useState, useEffect }  from "react";
import Logo from "../img/logo.svg";
import Auth from "./Auth";
import {Link} from "react-router-dom";
import firebase from "./Base";


export default function LoginPage(props) {
    const basename = process.env.NODE_ENV == 'production' ? '/angel' : '';
    const [user, setUser] = useState(false)
    firebase.auth().onAuthStateChanged(function (user) {
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
                    <Link to={basename +'/recipes/0'}>Рецепты</Link><br/>
                    <Link to={basename +'/rules'}>Правила</Link>
                </div>
            }

        </div>
    )

}
