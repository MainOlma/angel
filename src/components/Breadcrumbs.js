import React from "react";
import {
    Link,
} from "react-router-dom";

import withBreadcrumbs from "react-router-breadcrumbs-hoc";

const routes = [
    {path: '/recipes*/:id', breadcrumb: 'mmm'},
];

const Breadcrumbs = withBreadcrumbs(routes)(({tree, breadcrumbs}) => {

    const name = (key) => tree.find(cat => cat.cat_id == key)?.name

    return (
        <React.Fragment>
            {breadcrumbs.filter(({match}) => match.params.id != undefined).map(({breadcrumb, key, match}) => {
                return (<span>&nbsp;<Link to={key}>{name(match.params.id)}</Link>&nbsp;</span>)
            })}
        </React.Fragment>
    )
});

export default Breadcrumbs;