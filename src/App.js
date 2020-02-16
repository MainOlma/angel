import React, { Component}  from "react";
import ReactDOM from "react-dom";
import Logo from './img/logo.svg';
import './style/main.scss';

class HelloMessage extends React.Component {
    render() {
        return (
            <div className='greetings'>
                <img src={Logo} width={291} height={109}/>
                <h3>Хей гайз 🤚 </h3>
                <h3>Чтобы войти, введи пароль</h3>
            </div>
        );
    }
}

ReactDOM.render(
    <HelloMessage name="Angel Cakes"/>,
    document.getElementById('root')
);
