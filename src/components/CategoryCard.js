import React from "react";

function CategoryCard(props) {
    function handleClick(e, name) {
        e.preventDefault();
        console.log('click',name)
    }
    return (
        <div onClick={(e)=>handleClick(e,props.name)}>
            {props.name}
        </div>
    );
}

export default CategoryCard;