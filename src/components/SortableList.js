import React, {useEffect, useState} from "react";
import {ReactSortable} from "react-sortablejs";
import {updateRec} from "./DbActions";
import {Link, useParams} from "react-router-dom";

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

    return (
        <ReactSortable list={state} setList={setState}>
            {state.map(item => (
                <li key={item.rec_id}>
                    <Link
                        to={{
                            pathname: `${props.url}/recipe/${item.rec_id}`,
                            state: {recipe: true}
                        }}>{item.name}</Link>
                </li>
            ))}
        </ReactSortable>
    );
};