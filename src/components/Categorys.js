import React, {useState, useEffect} from "react";
import {Link, useParams} from "react-router-dom";
import base from './Base';
import Breadcrumbs from './Breadcrumbs'
import {newCategory, newRecipie, deleteCategory} from "./DbActions";


function Categorys(props) {
    let {id} = useParams();
    let [childrens_cats, setChildrens_cats] = useState([]);
    let [childrens_recs, setChildrens_recs] = useState([]);
    const [catName, setCatName] = useState('');
    const [currentCategoryName, setCurrentCategoryName] = useState('');
    const [recName, setRecName] = useState('');
    const basename = process.env.NODE_ENV == 'production' ? '/angel' : '';

    useEffect(() => {
        setChildrens_cats(props.tree.filter(cat => cat.parent_category == id));
        setChildrens_recs(props.recs.filter(rec => rec.cat_id == id));
    }, [id]);

    useEffect(() => {
        setCurrentCategoryName(props.tree.find(cat => cat.cat_id == id)?.name || '')
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

    return (
        <div>
            <Breadcrumbs tree={props.tree} id={id}/>
            {id!=0 && <h1>{currentCategoryName}</h1>}
            <div>
                <div>
                    <h2>Cats</h2>
                    <div className={'categories'}>
                        {childrens_cats.length > 0 &&
                        childrens_cats.map(cat => (
                            <div className={'category'} key={cat.cat_id}>
                                <Link to={`${props.match.url}/${cat.cat_id}`}>
                                    <img src={basename + (cat.img || '/img/default_cat.png')} width={559} height={228}/>
                                    <span className={'name'}>{cat.name}</span>
                                    {props.admin &&
                                        <button className={'delete'}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    onDeleteCategory(cat.cat_id, cat.name)
                                                }
                                                }>
                                            Delete
                                        </button>}
                                </Link>
                            </div>
                        ))
                        }
                        {props.admin && <div className={'category'}><input
                            value={catName}
                            onChange={e => {
                                setCatName(e.target.value);
                            }}/>
                            <button onClick={onAddCategory}>+</button>
                        </div>}
                    </div>
                </div>

                <div>
                    <h2>Recs</h2>
                    <ul>
                        {childrens_recs.length > 0 &&
                        childrens_recs.map(rec => (
                            <li key={rec.rec_id}>
                                <Link
                                    to={{
                                        pathname: `${props.match.url}/recipe/${rec.rec_id}`,
                                        state: {recipe: true}
                                    }}>{rec.name}</Link>

                            </li>
                        ))
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

export default Categorys;
