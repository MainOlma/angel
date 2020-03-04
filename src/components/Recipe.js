import React, {useState, useEffect} from "react";
import {useParams, Link, useRouteMatch} from "react-router-dom";
import Markdown from 'react-markdown';
import Breadcrumbs from "./Breadcrumbs";
import CKEditor from 'ckeditor4-react';
import base from "./Base";

export default function Recipe(props) {
    let {id, recipeId} = useParams();
    recipeId = id
    let {path, url} = useRouteMatch();
    let rec, cat, ingridientsIds, ingridients, imagesIds, recipieImages;
    const [second, setSecond] = useState(null);
    const basename= process.env.NODE_ENV=='production' ? '/angel' : '';

    const [recName, setRecName] = useState('');
    const [recHowTo, setRecHowTo] = useState('');

    const onUpdateRec = () => {
        const recData = {
            rec_id: recipeId,
            howto: recHowTo,
            cat_id: cat,
            desc: rec.desc,
            name: recName
        };
        const updates = {};
        updates['/recipies/' + recipeId] = recData;

        return base.database().ref().update(updates, function(error) {
            if (error) {
                // The write failed...
            } else {
                // Data saved successfully!
                window.location.reload(true);
            }
        });

    };

    if (props.recs) {
        if (props.second) recipeId = props.second
        rec = props.recs.find(rec => rec.rec_id == recipeId);
        cat = rec.cat_id

        ingridientsIds = props.composition.filter(ing => ing.rec_id == recipeId);
        imagesIds = props.recipieImages.filter(img => img.rec_id == recipeId);
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
        recipieImages = imagesIds.map(id => props.images.find(img => img.img_id == id.img_id))
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
    useEffect(() => {
        setRecName(rec.name);
        setRecHowTo(rec.howto);
        console.log("effect: ", recHowTo)
    }, [])


    return (
        <div className='recipe'>
            {props.second && <div className='close' onClick={HideIng}>Close</div>}
            <div className={second ? 'main half' : 'main full'}>
                <div className={'first'}>
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

                    <div className={'howTo'}><Markdown escapeHtml={false}
                                                       source={rec?.howto}/></div>

                </div>
                {recipieImages.length > 0 &&
                <div className={'imageList second'}>
                    {
                        recipieImages.map((img, i) => {
                            return (
                                <div className={'image'} key={i}>
                                    <img src={basename+img.src}/>
                                </div>
                            )
                        })
                    }
                </div>
                }

                <div className={'edit'}>
                    <input
                        value={recName}
                        placeholder={rec.name}
                        onChange={e => {
                            setRecName(e.target.value);
                        }}/>
                    {/*<input
                        value={recHowTo}
                        placeholder={rec.howto}
                        onChange={e => {
                            setRecHowTo(e.target.value);
                        }}/>*/}
                    <CKEditor
                        data={rec.howto}
                        onChange={e => {
                            setRecHowTo(e.editor.getData());
                        }}
                    />

                    <button onClick={onUpdateRec}>Update</button>
                </div>
            </div>



            {second &&
            <div className='sub'><Recipe {...props} second={second} parentCallback={callbackFunction}/></div>}

        </div>
    )

}
