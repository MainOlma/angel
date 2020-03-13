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
import Recipe from "./components/Recipe";
import Ingridients from "./components/Ingridients";
import Rules from "./components/Rules";

function HelloMessage(props) {
    const [url, setUrl] = useState(null);
    const [categories, setCategories] = useState(null);
    const [images, setImages] = useState(null);
    const [recipieImages, setRecipieImages] = useState(null);
    const [recipes, setRecipes] = useState(null);
    const [ingridients, setIngridients] = useState(null);
    const [composition, setComposition] = useState(null);
    const [user, setUser] = useState(null);
    const state=[0];

    useEffect(() => {

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setUser(firebase.auth().currentUser);
                // User is signed in.
                firebase.database().ref('/').on('value',
                   (snapshot) => {
                    debugger;
                        const cats = Object.values(snapshot.child('recipie_categories').val()) || 'Anonymous';
                        const recipes = Object.values(snapshot.child('recipies').val());
                        const ingridients = Object.values(snapshot.child('recipie_ingridients').val());
                        const composition = Object.values(snapshot.child('recipie_composition').val());
                        const images = Object.values(snapshot.child('images').val());
                        const recipieImages = Object.values(snapshot.child('recipie_images').val());

                        localStorage.setItem('recipie_categories', JSON.stringify(cats));
                        localStorage.setItem('recipes', JSON.stringify(recipes));
                        localStorage.setItem('recipie_ingridients', JSON.stringify(ingridients));
                        localStorage.setItem('recipie_composition', JSON.stringify(composition));
                        localStorage.setItem('images', JSON.stringify(images));
                        localStorage.setItem('recipieImages', JSON.stringify(recipieImages));

                        setCategories(cats || localStorage.recipie_categories);
                        setRecipes(recipes);
                        setIngridients(ingridients);
                        setComposition(composition);
                        setImages(images);
                        setRecipieImages(recipieImages);
                        state.push(1)
                    });

            } else {
                // No user is signed in.
            }
        });

    }, state.length);

    return (
        <Router basename={process.env.NODE_ENV=='production' ? '/angel' : ''}>
            <div>
                <Route path='/' exact render={()=><LoginPage user={user}/>}/>
                <Route path={'/ingridients'} render={() => <Ingridients ingridients={ingridients} recipes={recipes}/>}/>
                <Route path={'/rules'} render={() => <Rules/>}/>
                {categories && recipes && ingridients && composition && user && images && recipieImages?
                <Switch>

                    <Route path={`/recipes*/:id/recipe/:recipeId`}
                           render={(props)=><Recipe {...props}
                                                    tree={categories}
                                                    recs={recipes}
                                                    ingridients={ingridients}
                                                    composition={composition}
                                                    images={images}
                                                    recipieImages={recipieImages}/>}/>

                    <Route path={`/recipes*/:id`}
                           render={(props) => <Categorys {...props}
                                                         tree={categories}
                                                         recs={recipes}
                                                         ingridients={ingridients}
                                                         composition={composition}
                                                         images={images}
                                                         recipieImages={recipieImages}
                           />}
                    />

                </Switch> : null}
            </div>
        </Router>
    );
}

ReactDOM.render(
    <HelloMessage name="Angelos"/>,
    document.getElementById('root')
);
