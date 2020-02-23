import React from "react";
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

    let { id } = useParams();
    let childrens_cats = props.tree.filter(cat => cat.parent_category === parseInt(id))
    let childrens_recs = props.recs.filter(rec => rec.cat_id === parseInt(id))
    let { path, url } = useRouteMatch();

    return (
        <div>
            <Route exact path={path}>
            <h2>Cats</h2>
            </Route>
            <ul>
                {childrens_cats.map(cat => (
                    <li key={cat.cat_id}>
                        <Link to={`${props.match.url}/${cat.cat_id}`}>{cat.name}</Link>
                    </li>
                ))}
            </ul><ul>
                {childrens_recs.map(cat => (
                    <li key={cat.cat_id}>
                        <Link to={`${props.match.url}/${cat.cat_id}`}>{cat.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Categorys;