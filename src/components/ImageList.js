import React, {useState, useEffect} from 'react'
import {deleteImage, getImagesForRecipe} from "./DbActions";
import ImageUpload from "./ImageUpload";

export default function ImageList(props) {
    let imgs = [];
    const [images, setImages] = useState([]);

    useEffect(() => {
        getImagesForRecipe(props.recipeId, onGetImagesFromDb)
    }, []);

    const onGetImagesFromDb = (url) => {
        imgs = [...imgs, url];
        setImages(imgs)
    }

    const onDeleteSuccess = (url) => setImages(images.filter(el => el != url));

    const onDeleteImage = (url) => {
        if (window.confirm(`Выхотите удалить изображение?`)) {
            deleteImage(url, onDeleteSuccess)
        }
    };

    const onUpload = (url) => {
        imgs = [...images, url];
        setImages(imgs)
    }

    return (<div>
            {images.map((img, i) =>
                <div className={'image'}>
                    <img key={i} src={img}/>
                    {props.admin && <button className={'delete'} onClick={() => onDeleteImage(img)}>Delete</button>}
                </div>)
            }
            <ImageUpload recipeId={props.recipeId} onUpload={onUpload}/>
        </div>
    )
}