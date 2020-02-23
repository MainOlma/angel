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

export default  function Person(props) {
    let { url } = useRouteMatch();
    let { id } = useParams();
    let category = find(props.tree, parseInt(id));
    let childrens = props.tree.filter(cat => cat.parent_category === parseInt(id))

    let PEEPS = [
        { id: 0, name: "Michelle", friends: [1, 2, 3] },
        { id: 1, name: "Sean", friends: [0, 3] },
        { id: 2, name: "Kim", friends: [0, 1, 3] },
        { id: 3, name: "David", friends: [1, 2] }
    ];


    function find(tree, id){
        let PEEPS = tree;
        return PEEPS.find(p => p.parent_category === id);
    }

    return (
        <div>
            <h3>{category.name}’s categories:</h3>

            <ul>
                {childrens.map(cat => (
                    <li key={cat.cat_id}>
                        <Link to={`${url}/${cat.cat_id}`}>{cat.name}</Link>
                    </li>
                ))}
            </ul>

            <Switch>
                <Route path={`${url}/:id`}>
                    <Person tree={props.tree}/>
                </Route>
            </Switch>
        </div>
    );
}


