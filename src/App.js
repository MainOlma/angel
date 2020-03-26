import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom';

import Categories from './components/Categories';
import LoginPage from './components/LoginPage';
import Recipe from './components/Recipe';
import Ingredients from './components/Ingredients';
import Rules from './components/Rules';
import routes from './constants/routes';
import { firebase, db } from './lib/firebase';

import './style/main.scss';

// TODO: можно использовать localStorage для кеширования данных
// TODO: проверить сохранение юзера в системе после выхода из приложения
// TODO: редиректить логин на рецепты, если есть пользователь

// TODO: SortableCategories и SortableRecipes почти одинаковые — можно попробовать объединить
// TODO: убрать лычки в package.json

function HelloMessage(props) {
    const [categories, setCategories] = useState(null);
    const [images, setImages] = useState(null);
    const [recipeImages, setRecipeImages] = useState(null);
    const [recipes, setRecipes] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    const [composition, setComposition] = useState(null);
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(() => {
            const { currentUser } = db.auth();

            if (currentUser) {
                setUser(currentUser);

                // user is signed in - enable cache from firestore
                db.firestore().enablePersistence()
                    .catch(function(err) {
                        if (err.code == 'failed-precondition') {
                            console.log('Multiple tabs open, persistence can only be enabled in one tab at a a time.')
                        } else if (err.code == 'unimplemented') {
                            console.log('The current browser does not support all of the features required to enable persistence')
                        }
                    });

                db.database().ref('/').on('value',(snapshot) => {
                    const data = snapshot.val();
                    const categories = Object.values(data['recipie_categories']) || 'Anonymous';
                    const recipes = Object.values(data['recipies']);
                    const ingredients = Object.values(data['recipie_ingridients']);
                    const composition = Object.values(data['recipie_composition']);
                    const images = Object.values(data['images']);
                    const recipeImages = Object.values(data['recipie_images']);
                    const users = Object.values(data['users']);
                    const role = users.find(u => u.email == currentUser.email);

                    setCategories(categories);
                    setRecipes(recipes);
                    setIngredients(ingredients);
                    setComposition(composition);
                    setImages(images);
                    setRecipeImages(recipeImages);
                    setAdmin(role && role.admin);
                });
            }
            else setUser(null)

        });
        //console.log("------------->",location.pathname, routes.baseUrl(), routes.RECIPE_URL)
    }, []);

    return (
        <Router basename={routes.baseUrl()}>
            <Route path='/'  render={() => user ? <Redirect to={location.pathname==routes.baseUrl()+'/' ? routes.RECIPE_URL : location.pathname.replace('/angel','')}/> : <LoginPage />} />
            <Route path={routes.INGREDIENTS_URL} render={() => <Ingredients ingredients={ingredients} recipes={recipes} categories={categories}/>}/>
            <Route path={routes.RULES_URL} render={() => <Rules admin={admin}/>}/>
            {categories && recipes && ingredients && composition && user && admin != null && images && recipeImages &&
                <Switch>
                    <Route path={`/recipes*/:id/recipe/:recipeId`}
                           render={(props) => <Recipe {...props}
                                                      admin={admin}
                                                      categories={categories}
                                                      recs={recipes}
                                                      ingredients={ingredients}
                                                      composition={composition}
                                                      images={images}
                                                      recipieImages={recipeImages}
                                                      needUpdate={Date.now()}/>}/>

                    <Route path={`/recipes*/:id`}
                           render={(props) => <Categories {...props}
                                                          admin={admin}
                                                          categories={categories}
                                                          recs={recipes}
                                                          ingredients={ingredients}
                                                          composition={composition}
                                                          images={images}
                                                          recipieImages={recipeImages}
                           />}
                    />
                </Switch>
             }
        </Router>
    );
}

ReactDOM.render(
    <HelloMessage name='Angelos'/>,
    document.getElementById('root')
);
