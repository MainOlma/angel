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
import Breadcrumbs from './Breadcrumbs'


function Categorys(props) {

    let {id} = useParams();
    let {path, url} = useRouteMatch();
    const arr = [id]
    let [childrens_cats, setChildrens_cats] = useState([]);
    let [childrens_recs, setChildrens_recs] = useState([]);
    const [catName, setCatName] = useState('');
    const [recName, setRecName] = useState('');
    const basename= process.env.NODE_ENV=='production' ? '/angel' : '';

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
            <Breadcrumbs tree={props.tree}/>
            {props?.location?.state?.recipe ?
                <Recipe {...props}/>
                : <div>
                    <div>
                        <h2>Cats</h2>
                        <div className={'categories'}>
                            {childrens_cats.length > 0 &&
                            childrens_cats.map(cat => (
                                <div className={'category'} key={cat.cat_id}>
                                    <Link to={`${props.match.url}/${cat.cat_id}`}>
                                        <img src={basename + (cat.img || '/img/default_cat.png')} width={559} height={228}/>
                                        <span>{cat.name}</span>
                                    </Link>
                                </div>
                            ))
                            }
                            <div className={'category'}><input
                                value={catName}
                                onChange={e => {
                                    setCatName(e.target.value);
                                }}/>
                                <button onClick={onAddCategory}>+</button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2>Recs</h2>
                        <ul>
                            {childrens_recs.length > 0 &&
                            childrens_recs.map(rec => (
                                <li key={rec.rec_id}>
                                    <Link
                                        to={{
                                            pathname: `${props.match.url}/${rec.rec_id}`,
                                            state: {recipe: true}
                                        }}>{rec.name}</Link>

                                </li>
                            ))
                            }
                            <li><input
                                value={recName}
                                onChange={e => {
                                    setRecName(e.target.value);
                                }}/>
                                <button onClick={onAddRecipe}>+</button>
                            </li>
                        </ul>
                    </div>
                </div>
            }
        </div>);
}

export default Categorys;
