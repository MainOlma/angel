import React, {useState, useEffect} from "react";
import {useParams, Link, useRouteMatch} from "react-router-dom";
import Markdown from 'react-markdown';
import Breadcrumbs from "./Breadcrumbs";
import CKEditor from 'ckeditor4-react';
import Button from '@material-ui/core/Button';
import {updateRec} from "./DbActions";
import ETable from "./ETable";
import ImageList from "./ImageList";
import SelectParent from "./SelectParent";
import routes from '../constants/routes';

export default function Recipe(props) {
    let {recipeId} = useParams();
    let rec, cat, ingredients = [], imagesIds, recipieImages;
    const [second, setSecond] = useState(null);
    const [ID, setID] = useState(props.second || recipeId);
    const [recipe, setRecipe] = useState({});
    const [CAT, setCAT] = useState('');
    const [DESC, setDesc] = useState('');
    const [recName, setRecName] = useState('');
    const [summary, setSummary] = useState(0);
    const [summaryNew, setNewSummary] = useState(0);
    const [recHowTo, setRecHowTo] = useState('');
    const [ings, setIngs] = useState([]);
    const [loss, setLoss] = useState(rec?.loss);

    const onUpdateRec = () => {
        const recData = {
            rec_id: ID,
            howto: recHowTo,
            cat_id: CAT,
            desc: DESC,
            name: recName,
            loss: (loss != undefined || typeof loss == 'number') ? loss : 0
        };
        updateRec(ID, recData);
        setRecName(recName);
        setLoss(loss);
        setRecHowTo(recHowTo);
    };
    const needUpdate = changedRows => {
        setIngs(changedRows)
    };

    const getIngridients = () => {
        const ingredientsIds = props.composition.filter(ing => ing.rec_id == ID);
        return ingredientsIds
            .filter(ing => props.ingredients.find(i => i.ing_id == ing.ing_id))
            .map(ing => {
                const details = props.ingredients.find(i => i.ing_id === ing.ing_id)
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

    function ShowIng(id) {
        setSecond(id)
    }

    function HideIng() {
        props.parentCallback("Close second recipe!")
    }

    function callbackFunction(childData) {
        setSecond(null)
    }

    useEffect(() => {
        props.second && setID(props.second)
    }, [props.second]);

    useEffect(() => {
        if (props.recs) {
            if (props.second) recipeId = props.second;
            rec = props.recs.find(rec => rec.rec_id == ID);
            setRecipe(rec);
            cat = rec.cat_id;
            setCAT(cat);
            setDesc(rec.desc);
            imagesIds = props.recipieImages.filter(img => img.rec_id == ID);
            ingredients = getIngridients();
            recipieImages = imagesIds.map(id => props.images.find(img => img.img_id == id.img_id))
        }
        setRecName(rec.name);
        setLoss(rec.loss);
        setRecHowTo(rec.howto);
        setIngs(getIngridients());
    }, [ID]);

    useEffect(() => {
        const sum = (ings.reduce((acc, val) => +acc + val.quantity, 0) * (1 - loss / 100)).toFixed(1);
        setSummary(sum);
        setNewSummary(sum);
    }, [ings.map(d => d.name + d.quantity).join(','), loss]);


    return (
        <div>
            {!props.second && <Breadcrumbs categories={props.categories}/>}
            <div className='recipe'>
                {props.second && <div className='close' onClick={HideIng}>Close</div>}
                <div className={second ? 'main half' : 'main full'}>
                    <div className={'first'}>
                        <h1>{recName}</h1>
                        {props.admin &&
                            <SelectParent
                                for={'recipe'}
                                id={recipeId}
                                data={recipe}
                                categories={props.categories}/>
                        }

                        {ings.length > 0 &&
                        <div>
                            <div className='ingredients'>
                                <span>Потери {loss}</span>
                                <span>Выход <input placeholder={summary} value={summaryNew}
                                                   onChange={e => {
                                                       const val = e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
                                                       setNewSummary(val);
                                                   }}/></span>
                                {ings.map((ing, i) => {
                                        return (
                                            <div className='ingridient' key={i}>
                                                {ing.ing_rec_id ?
                                                    <div className='name link'
                                                         onClick={() => ShowIng(ing.ing_rec_id)}><span>{ing.name}</span>
                                                    </div>
                                                    : <div className='name'>{ing.name}</div>
                                                }
                                                <div
                                                    className='quantity'>{(ing.quantity * summaryNew / summary).toFixed(0)} г.
                                                </div>
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
                        <ImageList recipeId={recipeId} admin={props.admin}/>
                        {
                            /*recipieImages && recipieImages.map((img, i) => {
                                return (
                                    <div className={'image'} key={i}>
                                        <img src={routes.baseUrl() + img.src}/>
                                    </div>
                                )
                            })*/
                        }
                    </div>


                    {props.admin && <div className={'edit'}>
                        <label htmlFor="name">Название: </label>
                        <input
                            name={'name'}
                            value={recName}
                            placeholder={recName}
                            onChange={e => {
                                setRecName(e.target.value);
                            }}/>
                        <label htmlFor="loss">Потери (%): </label>
                        <input
                            name={'loss'}
                            value={loss}
                            placeholder={loss}
                            onChange={e => {
                                let val = parseInt(e.target.value);
                                val = val < 0 ? 0 : val;
                                val = val >= 100 ? 99 : val;
                                setLoss((typeof val == 'number' && val <= 100 && val >= 0) ? val : '');
                            }}/>
                        {recHowTo && <CKEditor
                            data={recHowTo}
                            onChange={e => {
                                setRecHowTo(e.editor.getData());
                            }}
                        />}
                        <Button className={'update'} onClick={onUpdateRec}>Сохранить</Button>
                        <ETable ingredients={ings} allIngredients={props.ingredients} currentRec={ID}
                                needUpdate={needUpdate}/>
                        <Link to={routes.INGREDIENTS_URL}>База ингредиентов</Link>


                    </div>}
                </div>


                {second &&
                <div className='sub'><Recipe {...props} second={second} parentCallback={callbackFunction}/></div>}

            </div>
        </div>
    )

}
