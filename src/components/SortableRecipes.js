import React, { useEffect, useState } from 'react';
import { ReactSortable } from 'react-sortablejs';
import { Link } from 'react-router-dom';
import { updateRec, getImagesForRecipe } from './DbActions';
import routes from '../constants/routes';

const RecipeImage = props => {
    const [image, setImage] = useState(null);

    useEffect(() => {
        getImagesForRecipe(props.recipeId, onGetImagesFromDb);
    }, []);

    const onGetImagesFromDb = url => {
        if (!image) {
            setImage(url || `${routes.baseUrl()}/img/default_cat.png`);
        }
    };

    return (<img className='categories-recipe-image' src={image} />);
}

export const SortableRecipes = props => {
    const [state, setState] = useState(props.data);

    useEffect(() => {
        setState(props.data)
    }, [props.data.length]);

    useEffect(() => {
        const changedList = state.map((row, i) => (i != row.order ? {...row, order: i} : row));
        setState(changedList);
        updateOrder(changedList)
    }, [state.map(it => it.rec_id).join(',')]);

    const updateOrder = (list) => {
        list.forEach(row => {
            updateRec(row.rec_id, row)
        })
    };

    const list = () =>
        (state.map(item => (
            <Link
                key={item.rec_id}
                className={'categories-recipe-item'}
                to={{
                    pathname: `${props.url}/recipe/${item.rec_id}`,
                    state: {recipe: true}
                }}
            >
                <RecipeImage recipeId={item.rec_id} />
                <span className='categories-recipe-name'>{item.name}</span>

                {props.admin &&
                    <button onClick={(e) => {
                        e.preventDefault();
                        props.onDelete(item.rec_id, item.name);
                    }}>Delete</button>
                }
            </Link>
        )));


    return (
        props.admin
            ? (
                <ReactSortable
                    className={'categories-recipes-list'}
                    list={state}
                    setList={setState}
                >
                   {list()}
                </ReactSortable>
            ) : (
                 <div className={'categories-recipes-list'}>
                     {list()}
                 </div>
            )
    );
};