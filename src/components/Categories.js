import React, {useState, useEffect} from "react";
import {useParams} from "react-router-dom";
import base from './Base';
import Breadcrumbs from './Breadcrumbs'
import {newCategory, newRecipie, deleteCategory, deleteRecipe, deleteComposition} from "./DbActions";
import ImageUpload from "./ImageUpload";
import {SortableList} from "./SortableList";
import {SortableGrid} from "./SortableGrid";


function Categories(props) {
    let {id} = useParams();
    let [childrens_cats, setChildrens_cats] = useState([]);
    let [childrens_recs, setChildrens_recs] = useState([]);
    const [catName, setCatName] = useState('');
    const [currentCategoryName, setCurrentCategoryName] = useState('');
    const [recName, setRecName] = useState('');
    const basename = process.env.NODE_ENV == 'production' ? '/angel' : '';

    useEffect(() => {
        setChildrens_cats(props.categories.filter(cat => cat.parent_category == id));
        setChildrens_recs(props.recs.filter(rec => rec.cat_id == id));
    }, [id]);

    useEffect(() => {
        setCurrentCategoryName(props.categories.find(cat => cat.cat_id == id)?.name || '')
    });

    const onAddRecipe = () => {
        const newKey = base.database().ref().child('recipies').push().key;
        const recData = {
            rec_id: newKey,
            howto: "Empty How To",
            cat_id: id,
            desc: "Empty Description",
            name: recName,
            loss: "0"
        };
        newRecipie(newKey, recData);
        setChildrens_recs([...childrens_recs, recData]);
    };

    const onAddCategory = () => {
        const newKey = base.database().ref().child('recipie_categories').push().key;
        const catData = {
            cat_id: newKey,
            img: "/img/cats/default.png",
            parent_category: id,
            name: catName
        };
        newCategory(newKey, catData);
        setChildrens_cats([...childrens_cats, catData]);
    };

    const onDeleteCategory = (id, name) => {
        if (window.confirm(`Выхотите удалить категорию ${name}?`)) {
            deleteCategory(id);
            const without_deleted = childrens_cats.filter((d, i) => d.cat_id != id);
            setChildrens_cats(without_deleted)
        }
    };
    const onDeleteRecipe = (id, name) => {
        if (window.confirm(`Выхотите удалить рецепт ${name}?`)) {
            deleteRecipe(id);
            const compositions = props.composition.filter(it => it.rec_id == id);
            compositions.length > 0 && compositions.forEach(it => deleteComposition(it.comp_id));
            const without_deleted = childrens_recs.filter((d, i) => d.rec_id != id);
            setChildrens_recs(without_deleted)
        }
    };


    return (
        <div className={'catalog'}>
            <Breadcrumbs categories={props.categories} id={id}/>
            {id != 0 && <h1>{currentCategoryName}</h1>}
            {props.admin && <ImageUpload key={id} categoryId={id} onUpload={()=>{}}/>}
            <div>
                <div className={'categoriesList'}>
                    <h2>Cats</h2>
                        {childrens_cats.length > 0 &&
                        <SortableGrid data={childrens_cats.sort((a, b) => a.order - b.order)}
                                      url={props.match.url}
                                      basename={basename}
                                      admin={props.admin}
                                      onDelete={(id,name)=>onDeleteCategory(id,name)}/>
                        }

                        {props.admin && <div className={'category'}><input
                            value={catName}
                            onChange={e => {
                                setCatName(e.target.value);
                            }}/>
                            <button onClick={onAddCategory}>+</button>
                        </div>}
                </div>

                <div className={'recipesList'}>
                    <h2>Recs</h2>
                    <ul>
                        {childrens_recs.length > 0 &&
                        <SortableList data={childrens_recs.sort((a, b) => a.order - b.order)}
                                      url={props.match.url}
                                      admin={props.admin}
                                      onDelete={(id,name)=>onDeleteRecipe(id,name)}/>
                        }
                        {props.admin && <li><input
                            value={recName}
                            onChange={e => {
                                setRecName(e.target.value);
                            }}/>
                            <button onClick={onAddRecipe}>+</button>
                        </li>}
                    </ul>
                </div>

            </div>

        </div>);
}

export default Categories;