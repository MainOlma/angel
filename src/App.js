import React, { useState, useEffect }  from "react";
import ReactDOM from "react-dom";
import Logo from './img/logo.svg';
import './style/main.scss';
import * as firebaseui from 'firebaseui';
import * as firebase from 'firebase';
import CategoryList from './components/CategoryList';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams,
    useRouteMatch
} from "react-router-dom";
import  Person from './components/Person'
import Categorys from "./components/Categorys";
import LoginPage from "./components/LoginPage";


function HelloMessage(props) {
    const [url,setUrl] = useState(null);
    const [categories,setCategories] = useState(null);
    const [recipes,setRecipes] = useState(null);
    const [ingridients,setIngridients] = useState(null);
    const [composition,setComposition] = useState(null);


    useEffect(() => {
        //setCategories( localStorage.categories)
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
        firebase.database().ref('/').once('value')
            .then((snapshot) => {
                const cats = snapshot.child('recipie_categories').val()  || 'Anonymous';
                const recipes = snapshot.child('recipies').val();
                const ingridients = snapshot.child('recipie_ingridients').val();
                const composition = snapshot.child('recipie_composition').val();


                localStorage.setItem('recipie_categories', JSON.stringify(cats));
                localStorage.setItem('recipes', JSON.stringify(recipes));
                localStorage.setItem('recipie_ingridients', JSON.stringify(ingridients));
                localStorage.setItem('recipie_composition', JSON.stringify(composition));

                setCategories(cats || localStorage.recipie_categories)
                setRecipes(recipes )
                setIngridients(ingridients )
                setComposition(composition )
        });

    }, []);



        //const items = categories ? categories : JSON.parse(localStorage.categories||'[]');
        return (
            <Router>
            <div>
                <Route path='/' exact component={LoginPage} />
                    {categories && recipes && ingridients && composition?
                <Route path={`/recipes/:id`}
                       render={(props) => <Categorys {...props}
                                                     tree={categories}
                                                     recs={recipes}
                                                     ingridients={ingridients}
                                                     composition={composition}

                       /> }/>: null}

            </div>
            </Router>



        );

}

ReactDOM.render(
    <HelloMessage name="Angelos"/>,
    document.getElementById('root')
);
