import React, {useState, useEffect} from "react";
import Recipe from "./Recipe";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams,
    useRouteMatch
} from "react-router-dom";
import base from './Base';

function Categorys(props) {

    let {id} = useParams();
    let {path, url} = useRouteMatch();
    const arr = [id]
    let [childrens_cats, setChildrens_cats] = useState([]);
    let [childrens_recs, setChildrens_recs] = useState([]);
    const [catName, setCatName] = useState('');
    const [recName, setRecName] = useState('');

    useEffect(() => {
        setChildrens_cats(props.tree.filter(cat => cat.parent_category == id));
        setChildrens_recs(props.recs.filter(rec => rec.cat_id == id));
    }, arr)


    const onAddRecipe = () => {
        // Get a key for a new Post.
        const newKey = base.database().ref().child('recipies').push().key;
        const recData = {
            rec_id: newKey,
            howto: "Empty How To",
            cat_id: id,
            desc: "Empty Description",
            name: recName
        };
        const updates = {};
        updates['/recipies/' + newKey] = recData;
        setChildrens_recs([...childrens_recs, recData]);

        return base.database().ref().update(updates);
    };

    const onAddCategory = () => {
        // Get a key for a new Post.
        const newKey = base.database().ref().child('recipie_categories').push().key;
        const catData = {
            cat_id: newKey,
            img: "/img/cats/default.png",
            parent_category: id,
            name: catName
        };
        const updates = {};
        updates['/recipie_categories/' + newKey] = catData;
        setChildrens_cats([...childrens_cats, catData]);

        return base.database().ref().update(updates);
    };

    return (
        <div>
            <Link to={`${props.match.url}`}>Назад</Link>
            <Switch>
                <Route path={`${props.match.path}/:recipeId`}>
                    <Recipe {...props}/>
                </Route>
                <Route path={`${props.match.path}`}>

                    <div>
                        <h2>Cats</h2>
                        <ul>
                            {childrens_cats.length > 0 &&
                            childrens_cats.map(cat => (
                                <li key={cat.cat_id}>
                                    <Link to={`${cat.cat_id}`}>{cat.name}</Link>
                                </li>
                            ))
                            }
                            <li><input
                                value={catName}
                                onChange={e => {
                                    setCatName(e.target.value);
                                }}
                            />
                                <button onClick={onAddCategory}>+</button>
                            </li>
                        </ul>
                    </div>


                    {
                        <div>
                            <h2>Recs</h2>
                            <ul>
                                {childrens_recs.length > 0 &&
                                childrens_recs.map(rec => (
                                    <li key={rec.rec_id}>
                                        <Link to={`${props.match.url}/${rec.rec_id}`}>{rec.name}</Link>
                                    </li>
                                ))
                                }
                                <li><input
                                    value={recName}
                                    onChange={e => {
                                        setRecName(e.target.value);
                                    }}
                                />
                                    <button onClick={onAddRecipe}>+</button>
                                </li>
                            </ul>
                        </div>
                    }
                </Route>


            </Switch>

        </div>
    );
}

export default Categorys;
