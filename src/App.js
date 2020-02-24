import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import './style/main.scss';

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams,
    useRouteMatch
} from "react-router-dom";

import Categorys from "./components/Categorys";
import LoginPage from "./components/LoginPage";
import firebase from './components/Base'

function HelloMessage(props) {
    const [url, setUrl] = useState(null);
    const [categories, setCategories] = useState(null);
    const [recipes, setRecipes] = useState(null);
    const [ingridients, setIngridients] = useState(null);
    const [composition, setComposition] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setUser(firebase.auth().currentUser);
                // User is signed in.
                firebase.database().ref('/').once('value')
                    .then((snapshot) => {
                        const cats = Object.values(snapshot.child('recipie_categories').val()) || 'Anonymous';
                        const recipes = Object.values(snapshot.child('recipies').val());
                        const ingridients = Object.values(snapshot.child('recipie_ingridients').val());
                        const composition = Object.values(snapshot.child('recipie_composition').val());

                        localStorage.setItem('recipie_categories', JSON.stringify(cats));
                        localStorage.setItem('recipes', JSON.stringify(recipes));
                        localStorage.setItem('recipie_ingridients', JSON.stringify(ingridients));
                        localStorage.setItem('recipie_composition', JSON.stringify(composition));

                        setCategories(cats || localStorage.recipie_categories);
                        setRecipes(recipes);
                        setIngridients(ingridients);
                        setComposition(composition);
                    });

            } else {
                // No user is signed in.
            }
        });

    }, []);

    return (
        <Router basename={process.env.NODE_ENV=='production' ? '/angel' : ''}>
            <div>
                <Route path='/' exact component={LoginPage}/>
                {categories && recipes && ingridients && composition && user ?
                    <Route path={`/recipes/:id`}
                           render={(props) => <Categorys {...props}
                                                         tree={categories}
                                                         recs={recipes}
                                                         ingridients={ingridients}
                                                         composition={composition}/>}
                    /> : null}
            </div>
        </Router>
    );
}

ReactDOM.render(
    <HelloMessage name="Angelos"/>,
    document.getElementById('root')
);
