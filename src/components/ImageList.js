import React, {useState, useEffect} from 'react'
import base from "./Base";

export default function ImageList(props) {
    const storageRef = base.storage().ref();
    const listRef = storageRef.child('images/' + props.recipeId + '/');
    let imgs = [];
    const [images, setImages] = useState([]);

    useEffect(() => {
        // Find all the prefixes and items.
        listRef.listAll().then(function (res) {
            res.items.forEach(function (itemRef) {
                // All the items under listRef.
                itemRef.getDownloadURL().then(function (url) {
                    imgs = [...imgs, url]
                    setImages(imgs)
                })
            });
        }).catch(function (error) {
            // Uh-oh, an error occurred!
        });
    }, []);
    return images.map((img, i) => <div className={'image'}><img key={i} src={img}/></div>);
}