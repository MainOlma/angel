import React, {useState, useEffect} from "react";
import {Select, MenuItem, FormControl, InputLabel} from "@material-ui/core";
import {updateRec, updateCategory} from "./DbActions";

export default function SelectParent(props) {
    const [parentId, setParentId] = useState('');
    const [categories, setCategories] = useState([]);
    const target = props.for;
    const parentField = target === 'recipe' ? 'cat_id' : 'parent_category';
    const idField = target === 'recipe' ? 'rec_id' : 'cat_id';
    let path = [];

    const onSuccessfulUpdate = () => alert('Категория изменена');

    const handleChange = event => {
        if (window.confirm(`Выхотите изменить категорию?`)) {
            setParentId(event.target.value);
            const newData = {
                ...props.data,
                [parentField]: event.target.value
            };

            if (target === 'recipe') updateRec(props.id, newData, onSuccessfulUpdate);
            if (target === 'category') updateCategory(props.id, newData, onSuccessfulUpdate)
        }
    };


    useEffect(() => {
        const hierarchy = (props.categories
            .filter(d => d.cat_id != props.id) // Нельзя переносить категорию в саму себя
            .map(d => {
            path = [];
            return getCategoryById(d.cat_id);
        }));
        const strings = [];
        hierarchy.forEach(el => {
            //нельзя переносить категорию в дочерние категории
            if ((target === 'category' && el.every(e => e[parentField] != props.id))
                || target === 'recipe'){
                const part =  {
                    id: el[0].cat_id,
                    name: el.reverse().map(d => d.name).join(' / ')
                };
                strings.push(part)
            }
        });
        setParentId(props.data[parentField]);
        setCategories(strings);
    }, [props.categories.length, props.data]);

    const getCategoryById = id => {
        const element = props.categories.find(el => el.cat_id == id);
        element != undefined && path.push(element);
        if (element && element.parent_category != "0") {
            getCategoryById(element.parent_category)
        }
        return path
    };

    return (
        <FormControl style={{ width: '100%', marginBottom: '20px' }}>
            <InputLabel id="select-label">Изменить родительскую категорию</InputLabel>
            <Select value={parentId}
                    labelId="select-label"
                    onChange={handleChange}>
                {categories.map((d, i) => <MenuItem key={i} value={d.id}>{d.name}</MenuItem>)}
            </Select>
        </FormControl>
    )
}