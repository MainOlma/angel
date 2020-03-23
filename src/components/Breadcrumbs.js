import React from "react";
import {Link} from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import firebase from '../components/Base';
import routes from '../constants/routes';

const localRoutes = [
    { path: '/recipes*/:id', breadcrumb: "without this won't work" },
];

const Breadcrumbs =  withBreadcrumbs(localRoutes)(({ categories,id, breadcrumbs }) => {
    const name = (key) => categories.find(cat => cat.cat_id == key)?.name;
    const filteredBreadcrumbs = breadcrumbs
        .filter(({ match }) => match.params.id != undefined)
        .filter(({ match }) => name(match.params.id) != undefined)
        .filter(({ match }) => match.params.id != id)
        .filter(({ match }) => match.params.id != 0);

    return (
        <div className='breadcrumbs'>
            <Link to={routes.RECIPE_URL}>
                <img src={`${routes.baseUrl()}/img/logo_s.png`} width={154} heigth={57} />
            </Link>
            {filteredBreadcrumbs.map(({ breadcrumb, key, match }, i) => (
                <span key={i}> → <Link to={key} >{name(match.params.id)}</Link>&nbsp;</span>
            ))}
            <Link to='/' onClick={() => firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }).catch(function(error) {
                // An error happened.
            })}>Выйти</Link>
        </div>
    )
});

export default Breadcrumbs;
