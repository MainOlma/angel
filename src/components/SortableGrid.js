import React, {useEffect, useState} from "react";
import {ReactSortable} from "react-sortablejs";
import {updateCategory} from "./DbActions";
import {Link} from "react-router-dom";
import ImageFromDb from "./ImageFromDb";

export const SortableGrid = props => {
    const [state, setState] = useState(props.data);

    useEffect(() => {
        setState(props.data)
    }, [props.data.length]);

    useEffect(() => {
        const changedList = state.map((row, i) => (i != row.order ? {...row, order: i} : row));
        setState(changedList);
        updateOrder(changedList)
    }, [state.map(it => it.cat_id).join(",")]);

    function updateOrder(list) {
        list.forEach(row => {
            updateCategory(row.cat_id, row)
            }
        )
    }

    return (
        <ReactSortable list={state}
                       setList={setState}
                       className={'categories'}
                       sort={props.admin ? true : false}>
            {state.map(item => (
                <div className={'category'} key={item.cat_id}>
                    <Link to={`${props.url}/${item.cat_id}`}>
                        <ImageFromDb categoryId={item.cat_id} default={props.basename + '/img/default_cat.png'}/>
                        <span className={'name'}>{item.name}</span>
                        {props.admin &&
                        <button className={'delete'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.onDelete(item.cat_id, item.name)
                                }
                                }>
                            Delete
                        </button>}
                    </Link>
                </div>
            ))}
        </ReactSortable>
    );
};