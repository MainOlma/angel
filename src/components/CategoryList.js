import React from "react";
import CategoryCard from "./CategoryCard";

function CategoryList(props) {
    const list = props.items.map((el, i) => <CategoryCard name={el.name} key={i}/>);

    return (
        <div>
            {list}
        </div>
    );
}

export default CategoryList;
