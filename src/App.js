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


function HelloMessage(props) {
    const [url,setUrl] = useState(null);
    const [categories,setCategories] = useState(null);
    const [recipes,setRecipes] = useState(null);


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
                const cats = snapshot.child('categories').val()  || 'Anonymous';
                const recipes = snapshot.child('recipies').val();
                localStorage.setItem('categories', JSON.stringify(cats));
                localStorage.setItem('recipes', JSON.stringify(recipes));
            //this.setState({categories: cats || localStorage.categories})
                //this.setState({url: useRouteMatch()})
                //let url=useRouteMatch();

                setCategories(cats || localStorage.categories)
                setRecipes(recipes )
        });

    }, []);



        //const items = categories ? categories : JSON.parse(localStorage.categories||'[]');
        return (
            <Router>
            <div className='greetings'>
                <img src={Logo} width={291} height={109}/>
                <h3>Хей гайз 🤚 </h3>
                <h3>Чтобы войти, введи пароль</h3>
                {/*
                    this.state ?
                    <div>{JSON.stringify(this.state.categories)} from fb</div> :
                        <div>{localStorage.categories} from ls</div>

                <CategoryList items={items} />*/}

                {/*<Router>
                    <Switch>
                        <Route path="/:id">
                            {this.state?
                                <Person tree={this.state.categories}/> :
                                null
                            }

                        </Route>
                        <Route path="/">
                            <Redirect to="/0" />
                        </Route>
                    </Switch>
                </Router>*/}


                    {categories && recipes?
                <Route path={`*/:id`} render={(props) => <Categorys {...props} tree={categories} recs={recipes}/> }/>:
                    null}

            </div>
            </Router>



        );

}

ReactDOM.render(
    <HelloMessage name="Angelos"/>,
    document.getElementById('root')
);
