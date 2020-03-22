import React, {useEffect, useState} from "react";
import {ReactSortable} from "react-sortablejs";
import {updateRec} from "./DbActions";
import {Link} from "react-router-dom";

export const SortableList = props => {
    const [state, setState] = useState(props.data);

    useEffect(() => {
        setState(props.data)
    }, [props.data.length]);

    useEffect(() => {
        const changedList = state.map((row, i) => (i != row.order ? {...row, order: i} : row));
        setState(changedList);
        updateOrder(changedList)
    }, [state.map(it => it.rec_id).join(",")]);

    function updateOrder(list) {
        list.forEach(row => {
                updateRec(row.rec_id, row)
            }
        )
    }

    const list = () =>
        (state.map(item => (
            <li key={item.rec_id}>
                <Link
                    to={{
                        pathname: `${props.url}/recipe/${item.rec_id}`,
                        state: {recipe: true}
                    }}>
                    {item.name}

                    {props.admin &&
                        <button className={'delete'}
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.onDelete(item.rec_id, item.name)
                                }
                                }>
                            -
                        </button>
                    }
                </Link>
            </li>
        )));


    return (
        props.admin ?
            <ReactSortable list={state} setList={setState}>
               {list()}
            </ReactSortable>
            : list()
    );
};