import React, {useState, useEffect} from "react";
import {Select, MenuItem, FormControl, InputLabel} from "@material-ui/core";
import {updateRec, updateCategory} from "./DbActions";

export default function SelectParent(props) {
    const [parentId, setParentId] = useState('');
    const [categories, setCategories] = useState([]);
    const target = props.for;
    const parentField = target === 'recipe' ? 'cat_id' : "parent_category";
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
        const hierarchy = (props.categories.map(d => {
            path = [];
            return getCategoryById(d.cat_id);
        }));
        const strings = hierarchy.map(el => {
            return {
                id: el[0].cat_id,
                name: el.reverse().map(d => d.name).join(' / ')
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
        <FormControl style={{'minWidth':'300px'}}>
            <InputLabel id="select-label">Изменить родительскую категорию</InputLabel>
            <Select value={parentId}
                    labelId="select-label"
                    onChange={handleChange}>
                {categories.map((d, i) => <MenuItem key={i} value={d.id}>{d.name}</MenuItem>)}
            </Select>
        </FormControl>
    )
}