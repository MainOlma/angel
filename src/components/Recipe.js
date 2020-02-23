import React, {useState, useEffect} from "react";
import {useParams, Link, useRouteMatch} from "react-router-dom";
import Markdown from 'react-markdown';

export default function Recipe(props) {
    let {id, recipeId} = useParams();
    let {path, url} = useRouteMatch();
    let rec, ingridientsIds, ingridients;
    const [second, setSecond] = useState(null);

    if (props.recs) {
        if (props.second) recipeId = props.second
        rec = props.recs.find(rec => rec.rec_id === parseInt(recipeId));
        ingridientsIds = props.composition.filter(ing => ing.rec_id === parseInt(recipeId));
        ingridients = ingridientsIds.map(ing => props.ingridients.find(i => i.ing_id === ing.ing_id))
    }


    function ShowIng(id) {
        setSecond(id)

    }

    useEffect(() => {
        if (props.second) recipeId = second;
    })


    return (
        <div className='recipe'>
            {!props.second && <Link to={`${props.match.url}`}>Назад</Link>}
            <h1>{rec?.name}</h1>
            <Markdown escapeHtml={true}
                      source={rec?.howto}/>
            {ingridients.length > 0 &&
            <div>
                <h2>Ингридиенты:</h2>

                {ingridients.map((ing, i) => ing.rec_id ?
                <p className={'link'} key={i} onClick={() => ShowIng(ing.rec_id)}>{ing.name}</p>
                : <p key={i}>{ing.name}</p>
                )}
            </div>
            }

            {second && <div className='sub'><Recipe {...props} second={second}/></div>}

        </div>
    )

}
