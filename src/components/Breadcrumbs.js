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
        <div className={'breadcrumbs'}>
            <Link to='/'>
                <img src={'/img/logo_s.png'} width={154} heigth={57}/>
            </Link>
            {breadcrumbs.filter(({match}) => match.params.id != undefined)
                .filter(({match}) =>name(match.params.id) != undefined)
                .map(({breadcrumb, key, match}) => {
                return (<span> → <Link to={key}>{name(match.params.id)}</Link>&nbsp;</span>)
            })}
        </div>
    )
});

export default Breadcrumbs;
