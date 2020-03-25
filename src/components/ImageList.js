import React, {useState, useEffect} from 'react'
import {deleteImage, getImagesForRecipe} from "./DbActions";
import ImageUpload from "./ImageUpload";

export default function ImageList(props) {
    let imgs = [];
    const [images, setImages] = useState([]);

    useEffect(() => {
        getImagesForRecipe(props.recipeId, onGetImagesFromDb)
    }, []);

    const onGetImagesFromDb = (url, i) => {
        if (!url) { return; }
        imgs = [...imgs, {url:url,i:i}];//imgs.splice(i, 0, url);
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
            {images.sort((a,b) => a.i-b.i).map((img, i) =>
                <div key={i} className={'image'}>
                    <img src={img.url}/>
                    {props.admin && <button className={'delete'} onClick={() => onDeleteImage(img.url)}>Delete</button>}
                </div>)
            }
            {props.admin &&
                <ImageUpload
                    recipeId={props.recipeId}
                    onUpload={onUpload}
                />
            }
        </div>
    )
}