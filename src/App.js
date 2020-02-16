import React, { Component}  from "react";
import ReactDOM from "react-dom";
import Logo from './img/logo.svg';
import './style/main.scss';
import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase';

class HelloMessage extends Component {



    componentDidMount() {

        const firebaseConfig = {
            apiKey: "AIzaSyAsO8JrmAE6QPA8btFOYXHEbrEgD86QSuM",
            authDomain: "kakeses.firebaseapp.com",
            databaseURL: "https://kakeses.firebaseio.com",
            projectId: "kakeses",
            storageBucket: "kakeses.appspot.com",
            messagingSenderId: "400500675421",
            appId: "1:400500675421:web:479ddb31f593a883daceb4"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.database().ref('/recipes/').once('value')
            .then((snapshot) => {
                var username = snapshot.val()  || 'Anonymous';
            this.setState({foo: username})
        });
    }


    render() {
        return (
            <div className='greetings'>
                <img src={Logo} width={291} height={109}/>
                <h3>Хей гайз 🤚 </h3>
                <h3>Чтобы войти, введи пароль</h3>
                {
                    this.state ?
                    <div>{JSON.stringify(this.state.foo)}</div> :
                        null
                }

            </div>
        );
    }
}

ReactDOM.render(
    <HelloMessage name="Angelos"/>,
    document.getElementById('root')
);
