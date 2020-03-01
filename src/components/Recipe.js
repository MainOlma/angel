import React, {useState, useEffect} from "react";
import {useParams, Link, useRouteMatch} from "react-router-dom";
import Markdown from 'react-markdown';
import Breadcrumbs from "./Breadcrumbs";

export default function Recipe(props) {
    let {id, recipeId} = useParams();
    recipeId = id
    let {path, url} = useRouteMatch();
    let rec, ingridientsIds, ingridients;
    const [second, setSecond] = useState(null);

    if (props.recs) {
        if (props.second) recipeId = props.second
        rec = props.recs.find(rec => rec.rec_id == recipeId);
        ingridientsIds = props.composition.filter(ing => ing.rec_id == recipeId);
        ingridients = ingridientsIds.map(ing => {
            const details = props.ingridients.find(i => i.ing_id === ing.ing_id)
            return ({
                id: ing.ing_id,
                name: details.name,
                quantity: ing.quantity,
                rec_id: details.rec_id,
                units: details.units,
            })

        })
    }


    function ShowIng(id) {
        setSecond(id)

    }

    function HideIng() {
        props.parentCallback("Close second recipe!")

    }

    function callbackFunction(childData) {
        setSecond(false)
    }

    useEffect(() => {
        if (props.second) recipeId = second;
    })


    return (
        <div className='recipe'>
            {props.second && <div className='close' onClick={HideIng}>Close</div>}
            <div className='main'>
                <h1>{rec?.name}</h1>

                {ingridients.length > 0 &&
                <div>
                    <div className='ingridients'>
                        {ingridients.map((ing, i) => {
                                return (
                                    <div className='ingridient' key={i}>
                                        {ing.rec_id ?
                                            <div className='name link'
                                                 onClick={() => ShowIng(ing.rec_id)}><span>{ing.name}</span></div>
                                            : <div className='name'>{ing.name}</div>
                                        }
                                        <div className='quantity'>{ing.quantity} {ing.units}</div>
                                    </div>
                                )
                            }
                        )}
                    </div>
                </div>
                }

                <Markdown escapeHtml={true}
                          source={rec?.howto}/>

            </div>

            {second &&
            <div className='sub'><Recipe {...props} second={second} parentCallback={callbackFunction}/></div>}

        </div>
    )

}
