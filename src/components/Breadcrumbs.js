import React from "react";
import {Link} from "react-router-dom";
import withBreadcrumbs from "react-router-breadcrumbs-hoc";
import firebase from '../components/Base'

const routes = [
    {path: '/recipes*/:id', breadcrumb: 'without this wont working'},
];

const Breadcrumbs =  withBreadcrumbs(routes)(({categories,id, breadcrumbs}) => {

    const name = (key) => categories.find(cat => cat.cat_id == key)?.name;
    const basename= process.env.NODE_ENV=='production' ? '/angel' : '';

    return (
        <div className={'breadcrumbs'}>
            <Link to='/recipes/0'>
                <img src={basename+'/img/logo_s.png'} width={154} heigth={57}/>
            </Link>
            {breadcrumbs.filter(({match}) => match.params.id != undefined)
                .filter(({match}) => name(match.params.id) != undefined)
                .filter(({match}) => match.params.id != id)
                .filter(({match}) => match.params.id != 0)
                .map(({breadcrumb, key, match},i) => {
                return (<span key={i}> → <Link to={key} >{name(match.params.id)}</Link>&nbsp;</span>)
            })}
            <Link to='/' onClick={() => firebase.auth().signOut().then(function() {
                // Sign-out successful.
            }).catch(function(error) {
                // An error happened.
            })}>Выйти</Link>
        </div>
    )
});

export default Breadcrumbs;
