import React, { useState, useEffect }  from "react";
import Logo from "../img/logo.svg";
import Auth from "./Auth";


export default function LoginPage() {
    return (
        <div className='greetings'>
            <img src={Logo} width={291} height={109}/>
            <h3>Хей гайз 🤚 </h3>
            <h3>Чтобы войти, введи пароль</h3>
            <Auth/>
        </div>
    )

}
