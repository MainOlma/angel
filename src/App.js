import React, {useState, useEffect} from "react";
import ReactDOM from "react-dom";
import './style/main.scss';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";

import Categories from "./components/Categories";
import LoginPage from "./components/LoginPage";
import firebase from './components/Base'
import Recipe from "./components/Recipe";
import Ingredients from "./components/Ingredients";
import Rules from "./components/Rules";

function HelloMessage(props) {
    const [categories, setCategories] = useState(null);
    const [images, setImages] = useState(null);
    const [recipieImages, setRecipieImages] = useState(null);
    const [recipes, setRecipes] = useState(null);
    const [ingredients, setIngridients] = useState(null);
    const [composition, setComposition] = useState(null);
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);
    const state = [0];

    useEffect(() => {

        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setUser(firebase.auth().currentUser);
                // User is signed in.
                firebase.database().ref('/').on('value',
                    (snapshot) => {

                        const categories = Object.values(snapshot.child('recipie_categories').val()) || 'Anonymous';
                        const recipes = Object.values(snapshot.child('recipies').val());
                        const ingredients = Object.values(snapshot.child('recipie_ingridients').val());
                        const composition = Object.values(snapshot.child('recipie_composition').val());
                        const images = Object.values(snapshot.child('images').val());
                        const recipieImages = Object.values(snapshot.child('recipie_images').val());
                        const users = Object.values(snapshot.child('users').val());
                        const role = users.find(u => u.email == user.email);

                        localStorage.setItem('recipie_categories', JSON.stringify(categories));
                        localStorage.setItem('recipes', JSON.stringify(recipes));
                        localStorage.setItem('recipie_ingredients', JSON.stringify(ingredients));
                        localStorage.setItem('recipie_composition', JSON.stringify(composition));
                        localStorage.setItem('images', JSON.stringify(images));
                        localStorage.setItem('recipieImages', JSON.stringify(recipieImages));

                        setCategories(categories /*|| localStorage.recipie_categories*/);
                        setRecipes(recipes);
                        setIngridients(ingredients);
                        setComposition(composition);
                        setImages(images);
                        setRecipieImages(recipieImages);
                        setAdmin(role && role.admin);
                        state.push(1)
                    });

            } else {
                // No user is signed in.
            }
        });

    }, [state.length]);

    return (
        <Router basename={process.env.NODE_ENV == 'production' ? '/angel' : ''}>
            <div>
                <Route path='/' exact render={() => <LoginPage user={user}/>}/>
                <Route path={'/ingredients'} render={() => <Ingredients ingredients={ingredients} recipes={recipes}/>}/>
                <Route path={'/rules'} render={() => <Rules admin={admin}/>}/>
                {categories && recipes && ingredients && composition && user && admin!=null && images && recipieImages ?
                    <Switch>

                        <Route path={`/recipes*/:id/recipe/:recipeId`}
                               render={(props) => <Recipe {...props}
                                                          admin={admin}
                                                          categories={categories}
                                                          recs={recipes}
                                                          ingredients={ingredients}
                                                          composition={composition}
                                                          images={images}
                                                          recipieImages={recipieImages}/>}/>

                        <Route path={`/recipes*/:id`}
                               render={(props) => <Categories {...props}
                                                              admin={admin}
                                                              categories={categories}
                                                              recs={recipes}
                                                              ingredients={ingredients}
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
