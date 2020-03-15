import React, {useState, useEffect} from "react";
import {useParams, Link, useRouteMatch} from "react-router-dom";
import Markdown from 'react-markdown';
import Breadcrumbs from "./Breadcrumbs";
import CKEditor from 'ckeditor4-react';
import Button from '@material-ui/core/Button';

import {updateRec} from "./DbActions";
import ETable from "./ETable";
import ImageUpload from "./ImageUpload";
import ImageList from "./ImageList";

export default function Recipe(props) {
    let {id, recipeId} = useParams();
    //recipeId = id
    let {path, url} = useRouteMatch();
    let rec, cat, ingridientsIds, ingridients = [], imagesIds, recipieImages;
    const [second, setSecond] = useState(null);
    const basename = process.env.NODE_ENV == 'production' ? '/angel' : '';

    const [recName, setRecName] = useState('');

    const [summary, setSummary] = useState(0);
    const [summaryNew, setNewSummary] = useState(0);
    const [recHowTo, setRecHowTo] = useState('');

    const [ings, setIngs] = useState([]);

    const onUpdateRec = () => {
        const recData = {
            rec_id: recipeId,
            howto: recHowTo,
            cat_id: cat,
            desc: rec.desc,
            name: recName,
            loss: loss != undefined ? loss : 0
        };
        updateRec(recipeId, recData);
        setRecName(recName);
        setLoss(loss);
        setRecHowTo(recHowTo);
    };
    const needUpdate=(changedRows)=>{
        setIngs(changedRows)
    };

    const getIngridients =()=>{
        const ingridientsIds = props.composition.filter(ing => ing.rec_id == recipeId);
        return  ingridientsIds.map(ing => {
            const details = props.ingridients.find(i => i.ing_id === ing.ing_id)
            return ({
                ing_id: ing.ing_id,
                comp_id: ing.comp_id,
                ing_rec_id: details.rec_id,
                rec_id: ing.rec_id,
                name: details.name,
                quantity: +ing.quantity
            })

        });
    };

    if (props.recs) {
        if (props.second) recipeId = props.second
        rec = props.recs.find(rec => rec.rec_id == recipeId);
        cat = rec.cat_id
        imagesIds = props.recipieImages.filter(img => img.rec_id == recipeId);
        ingridients = getIngridients();
        recipieImages = imagesIds.map(id => props.images.find(img => img.img_id == id.img_id))
    }
    const [loss, setLoss] = useState(rec?.loss);


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

    });

    useEffect(() => {
        setRecName(rec.name);
        setLoss(rec.loss);
        setRecHowTo(rec.howto);
        setIngs(getIngridients());
    }, []);

    useEffect(() => {
        const sum = (ingridients.reduce((acc, val) => +acc + val.quantity, 0) * (1 - loss / 100)).toFixed(1);
        setSummary(sum);
        setNewSummary(sum)
        setIngs(getIngridients());
    }, [ings.length]);


    return (
        <div>
            <Breadcrumbs tree={props.tree}/>
            <div className='recipe'>
                {props.second && <div className='close' onClick={HideIng}>Close</div>}
                <div className={second ? 'main half' : 'main full'}>
                    <div className={'first'}>
                        <h1>{recName}</h1>

                        {ingridients.length > 0 &&
                        <div>
                            <div className='ingridients'>
                                <span>Потери {loss}</span>
                                <span>Выход <input placeholder={summary} value={summaryNew} onChange={e => {
                                    setNewSummary(e.target.value)
                                }}/></span>
                                {ings.map((ing, i) => {
                                        return (
                                            <div className='ingridient' key={i}>
                                                {ing.rec_id ?
                                                    <div className='name link'
                                                         onClick={() => ShowIng(ing.ing_rec_id)}><span>{ing.name}</span>
                                                    </div>
                                                    : <div className='name'>{ing.name}</div>
                                                }
                                                <div
                                                    className='quantity'>{(ing.quantity * summaryNew / summary).toFixed(1)} г.</div>
                                            </div>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                        }

                        <div className={'howTo'}><Markdown escapeHtml={false}
                                                           source={recHowTo}/></div>

                    </div>

                    <div className={'imageList second'}>
                        <ImageList recipeId={recipeId}/>
                        {
                            recipieImages && recipieImages.map((img, i) => {
                                return (
                                    <div className={'image'} key={i}>
                                        <img src={basename + img.src}/>
                                    </div>
                                )
                            })
                        }
                    </div>


                    {props.admin && <div className={'edit'}>
                        <label htmlFor="name">Название: </label>
                        <input
                            name={'name'}
                            value={recName}
                            placeholder={rec.name}
                            onChange={e => {
                                setRecName(e.target.value);
                            }}/>
                        <label htmlFor="loss">Потери: </label>
                        <input
                            name={'loss'}
                            value={loss}
                            placeholder={rec.loss}
                            onChange={e => {
                                setLoss(e.target.value);
                            }}/>
                        <CKEditor
                            data={rec.howto}
                            onChange={e => {
                                setRecHowTo(e.editor.getData());
                            }}
                        />
                        <Button className={'update'} onClick={onUpdateRec}>Сохранить</Button>
                        <ETable ingridients={ings} allIngridients={props.ingridients} currentRec={recipeId} needUpdate={needUpdate}/>
                        <Link to={'/ingridients'}>База ингридиентов</Link>
                        <ImageUpload recipeId={recipeId}/>

                    </div>}
                </div>


                {second &&
                <div className='sub'><Recipe {...props} second={second} parentCallback={callbackFunction}/></div>}

            </div>
        </div>
    )

}
