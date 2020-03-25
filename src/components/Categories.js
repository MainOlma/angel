import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {
    newCategory, deleteCategory,
    newRecipie, deleteRecipe,
    deleteComposition,
} from './DbActions';
import Header from './Header';
import Footer from './Footer';
import ImageUpload from './ImageUpload';
import { SortableRecipes } from './SortableRecipes';
import { SortableCategories } from './SortableCategories';
import SelectParent from './SelectParent';
import routes from '../constants/routes';
import { db } from '../lib/firebase';

function Categories(props) {
    const { id } = useParams();
    const [childrenCats, setChildrenCats] = useState([]);
    const [childrenRecs, setChildrenRecs] = useState([]);
    const [category, setCategory] = useState({});

    const [categoryName, setCategoryName] = useState('');
    const [currentCategoryName, setCurrentCategoryName] = useState('');
    const [recipeName, setRecipeName] = useState('');

    useEffect(() => {
        setChildrenCats(props.categories.filter(cat => cat.parent_category == id));
        setChildrenRecs(props.recs.filter(rec => rec.cat_id == id));
        setCategory(props.categories.find(cat => cat.cat_id == id));
        setCurrentCategoryName(props.categories.find(cat => cat.cat_id == id)?.name || 'Рецепты');
    }, [props.categories.length, , id]);

    const onAddRecipe = () => {
        const newKey = db.database().ref().child('recipies').push().key;
        const recData = {
            rec_id: newKey,
            howto: 'Empty How To',
            cat_id: id,
            desc: 'Empty Description',
            name: recipeName,
            loss: '0'
        };
        newRecipie(newKey, recData);
        setChildrenRecs([...childrenRecs, recData]);
    };

    const onAddCategory = () => {
        const newKey = db.database().ref().child('recipie_categories').push().key;
        const catData = {
            cat_id: newKey,
            img: '/img/cats/default.png',
            parent_category: id,
            name: categoryName
        };
        newCategory(newKey, catData);
        setChildrenCats([...childrenCats, catData]);
    };

    const onDeleteCategory = (id, name) => {
        if (window.confirm(`Выхотите удалить категорию ${name}?`)) {
            deleteCategory(id);
            const without_deleted = childrenCats.filter((d, i) => d.cat_id != id);
            setChildrenCats(without_deleted)
        }
    };

    const onDeleteRecipe = (id, name) => {
        if (window.confirm(`Выхотите удалить рецепт ${name}?`)) {
            deleteRecipe(id);
            const compositions = props.composition.filter(it => it.rec_id == id);
            compositions.length > 0 && compositions.forEach(it => deleteComposition(it.comp_id));
            const without_deleted = childrenRecs.filter((d, i) => d.rec_id != id);
            setChildrenRecs(without_deleted)
        }
    };

    return (
        <div>
            <Header categories={props.categories} />

            <div className='page-content categories'>
                <h1>{currentCategoryName}</h1>

                {props.admin && id != 0 && category &&
                    <SelectParent
                        for={'category'}
                        id={id}
                        data={category}
                        categories={props.categories}
                    />
                }

                {props.admin &&
                    <ImageUpload key={id} categoryId={id} onUpload={() => {}} />
                }

                <div className='categories-list'>
                    {childrenCats.length > 0 &&
                        <SortableCategories
                            data={childrenCats.sort((a, b) => a.order - b.order)}
                            url={props.match.url}
                            basename={routes.baseUrl()}
                            admin={props.admin}
                            onDelete={onDeleteCategory}
                         />
                    }

                    {props.admin &&
                        <div className={'categories-edit-name'}>
                            <span>Добавить новую категорию&nbsp;&nbsp;</span>
                            <input
                                value={categoryName}
                                onChange={e => setCategoryName(e.target.value)}
                            />
                            <button onClick={onAddCategory}>+</button>
                        </div>
                    }
                </div>

                <div className='categories-recipes-list'>
                    {childrenRecs.length > 0 &&
                        <SortableRecipes
                            data={childrenRecs.sort((a, b) => a.order - b.order)}
                            url={props.match.url}
                            admin={props.admin}
                            onDelete={onDeleteRecipe}
                        />
                    }

                    {props.admin &&
                        <div className={'categories-edit-name'}>
                            <span>Добавить новый рецепт категорию&nbsp;&nbsp;</span>
                            <input
                                value={recipeName}
                                onChange={e => setRecipeName(e.target.value)}
                            />
                            <button onClick={onAddRecipe}>+</button>
                        </div>
                    }
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Categories;
