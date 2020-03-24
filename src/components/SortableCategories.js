import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import { updateCategory } from './DbActions';
import ImageFromDb from './ImageFromDb';

export const SortableCategories = props => {
    const [state, setState] = useState(props.data);

    useEffect(() => {
        setState(props.data)
    }, [props.data.map(el => el.name).join(',')]);

    useEffect(() => {
        const changedList = state.map((row, i) => (i != row.order ? {...row, order: i} : row));
        setState(changedList);
        updateOrder(changedList)
    }, [state.map(it => it.cat_id).join(',')]);

    const updateOrder = (list) => {
        list.forEach(row => {
            updateCategory(row.cat_id, row);
        })
    };

    const grid = () => (
        state.map(item => (
            <Link
                key={item.cat_id}
                className={'categories-grid-item'}
                to={`${props.url}/${item.cat_id}`}
            >
                <ImageFromDb
                    categoryId={item.cat_id}
                    default={`${props.basename}/img/default_cat.png`}
                />
                <span>{item.name}</span>

                {props.admin &&
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            props.onDelete(item.cat_id, item.name);
                        }}
                    >Delete</button>
                }
            </Link>
        ))
    );

    return (
        props.admin
            ? (
                <ReactSortable
                    list={state}
                    setList={setState}
                    className={'categories-grid'}
                >
                    {grid()}
                </ReactSortable>
            ) : (
                <div className={'categories-grid'}>
                    {grid()}
                </div>
            )
    );
};