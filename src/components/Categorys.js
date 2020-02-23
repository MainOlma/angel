import React from "react";
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

function Categorys(props) {

    let {id} = useParams();
    let childrens_cats = props.tree.filter(cat => cat.parent_category === parseInt(id));
    let childrens_recs = props.recs.filter(rec => rec.cat_id === parseInt(id));
    let {path, url} = useRouteMatch();

    return (
        <div>
            <Switch>
                <Route path={`${props.match.path}/:recipeId`}>
                    <Recipe {...props} />
                </Route>
                <Route path={`${props.match.path}`}>
                    {childrens_cats.length>0 &&
                        <div>
                            <h2>Cats</h2>
                            <ul>
                                {childrens_cats.map(cat => (
                                    <li key={cat.cat_id}>
                                        <Link to={`${cat.cat_id}`}>{cat.name}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    }

                    {
                        childrens_recs.length>0 &&
                            <div>
                                <h2>Recs</h2>
                                <ul>
                                    {childrens_recs.map(rec => (
                                        <li key={rec.cat_id}>
                                            <Link to={`${props.match.url}/${rec.rec_id}`}>{rec.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                    }
                </Route>


            </Switch>

        </div>
    );
}

export default Categorys;
