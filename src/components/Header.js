import React from 'react';
import {Link} from 'react-router-dom';
import Breadcrumbs from 'react-router-breadcrumbs-hoc';
import routes from '../constants/routes';
import { db } from '../lib/firebase';

const onLogOutClick = (e) => {
    if (window.confirm(`Вы уверены что хотите выйти?`)) {
        db.auth().signOut()
            .then(() => {})
            .catch(() => {});
    } else {
        e.preventDefault();
    }

};

const Header =  Breadcrumbs()(({ categories, id, breadcrumbs }) => {
    const name = (key) => categories.find(cat => cat.cat_id == key)?.name;

    // hide first two and current page breadcrumbs and filter by avaliable titles
    const filteredBreadcrumbs = breadcrumbs
        .slice(2, breadcrumbs.length - 1)
        .map(b => {
            const rts = b.key.split('/');
            const title = name(rts[rts.length - 1]);

            return { title, path: b.key };
        })
        .filter(b => b.title);

    return (
        <div className='header'>
            <Link className='header-logo' to={routes.RECIPE_URL}>
                <img src={`${routes.baseUrl()}/img/logo_s.png`} />
            </Link>
            <div className='header-breadcrumbs'>
                {filteredBreadcrumbs.map(({ key, title, path }) => (
                    <span key={path}> → <Link to={path}>{title}</Link>&nbsp;</span>
                ))}
            </div>
            <Link
                className='header-logout'
                to='/'
                onClick={onLogOutClick}
            >
                Выйти
            </Link>
        </div>
    )
});

export default Header;
