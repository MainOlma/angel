import React, { useState, useEffect } from 'react';
import { useParams, Link, useRouteMatch } from 'react-router-dom';
import Header from './Header';
import CKEditor from 'ckeditor4-react';
import Button from '@material-ui/core/Button';
import {updateRec} from './DbActions';
import ETable from './ETable';
import ImageList from './ImageList';
import SelectParent from './SelectParent';
import routes from '../constants/routes';

function RecipeColumn(props) {
    let {recipeId} = useParams();
    let rec, cat, ingredients = [], imagesIds, recipieImages;
    const [ID, setID] = useState(props.second || recipeId);
    const [recipe, setRecipe] = useState({});
    const [CAT, setCAT] = useState('');
    const [DESC, setDesc] = useState('');
    const [recName, setRecName] = useState('');
    const [summary, setSummary] = useState(0);
    const [summaryNew, setNewSummary] = useState(0);
    const [recHowTo, setRecHowTo] = useState('initialState');
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
        <div className={props.hasSecond || props.second ? 'recipe-column half' : 'recipe-column full'}>
            <h1>{recName}</h1>

            <div className='recipe-info'>
                {props.admin &&
                    <SelectParent
                        for={'recipe'}
                        id={recipeId}
                        data={recipe}
                        categories={props.categories}/>
                }

                {ings.length > 0 &&
                    <table className='recipe-ingredients'>
                        <tbody>
                            <tr className='recipe-ingredient'>
                                <td className='recipe-ingredient-name bold'>Выход</td>
                                <td className='recipe-ingredient-value'>
                                    <input
                                        placeholder={summary}
                                        value={summaryNew}
                                        onChange={e => setNewSummary(e.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1'))}
                                    />
                                </td>
                            </tr>
                            <tr className='recipe-ingredient'>
                                <td className='recipe-ingredient-name'>Потери</td>
                                <td className='recipe-ingredient-value'>{loss}</td>
                            </tr>

                            {ings.map((ing, i) => (
                                <tr key={i} className='recipe-ingredient'>
                                    <td
                                        className={ing.ing_rec_id ? 'recipe-ingredient-name active' : 'recipe-ingredient-name'}
                                        onClick={() => props.onShowIng(ing.ing_rec_id)}
                                    >
                                        <span>{ing.name}</span>
                                    </td>
                                    <td className='recipe-ingredient-value'>
                                        {(ing.quantity * summaryNew / summary).toFixed(0)} г.
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
                <div
                    className={'recipe-rules'}
                    dangerouslySetInnerHTML={{ __html: recHowTo }}
                />
            </div>

            <div className='recipe-images'>
                <ImageList recipeId={props.second || recipeId} admin={props.admin}/>
            </div>


            {props.admin && <div className={'edit'}>
                <label htmlFor='name'>Название: </label>
                <input
                    name={'name'}
                    value={recName}
                    placeholder={recName}
                    onChange={e => {
                        setRecName(e.target.value);
                    }}/>
                <label htmlFor='loss'>Потери (%): </label>
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
                {recHowTo!='initialState' && <CKEditor
                    data={recHowTo}
                    onChange={e => {
                        setRecHowTo(e.editor.getData());
                    }}
                    config={ {
                        extraPlugins: 'embed,autoembed,image2',
                        embed_provider: '//ckeditor.iframe.ly/api/oembed?url={url}&callback={callback}',
                    } }
                />}
                <Button className={'update'} onClick={onUpdateRec}>Сохранить</Button>
                <ETable ingredients={ings} allIngredients={props.ingredients} currentRec={ID}
                        needUpdate={needUpdate}/>
                <Link to={routes.INGREDIENTS_URL}>База ингредиентов</Link>
            </div>}
        </div>
    );
}


export default function Recipe(props) {
    const [second, setSecond] = useState(null);

    function onShowIng(id) {
        if (id) {
            setSecond(id);
        }
    }

    function onHideIng() {
        setSecond(null);
    }

    return (
        <div>
            <Header categories={props.categories}/>
            <div className='page-content recipe'>
                {second &&
                    <div className='recipe-close' onClick={onHideIng}>✕</div>
                }

                <RecipeColumn {...props} hasSecond={second} onShowIng={onShowIng} />


                {second &&
                    <RecipeColumn {...props} second={second} />
                }
            </div>
        </div>
    );
}
