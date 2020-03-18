import React, {useState, useEffect} from 'react'
import base from "./Base";

export default function ImageFromDb(props) {
    const storageRef = base.storage().ref();
    const listRef = storageRef.child('images/categories/' + props.categoryId +'/');
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
            if (res.items.length === 0) {
                setImages([props.default])
            }
        }).catch(function (error) {
            // Uh-oh, an error occurred!
        });
    }, []);
    return images.map((img, i) => <img key={i} src={props.basename+img} width={559} height={228}/>);
}