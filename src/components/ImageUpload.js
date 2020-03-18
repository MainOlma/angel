import React from 'react';
import {newImage} from "./DbActions";

class ImageUpload extends React.Component {
    state = {
        files: [],
        imagesPreviewUrls: []
    };

    _handleSubmit = e => {
        e.preventDefault();
        const files = this.state.files;
        if (files.length > 0){
            files.forEach(file => {
                let path = 'images/'+this.props.recipeId+'/'+file.name;
                if (this.props.categoryId) path = 'images/categories/'+this.props.categoryId+'/'+this.props.categoryId;
                newImage(file, path);
            })
        }
    };

    _handleImageChange = e => {
        e.preventDefault();

        // FileList to Array
        let files = Array.from(e.target.files);

        // File Reader for Each file and and update state arrays
        files.forEach((file, i) => {
            let reader = new FileReader();

            reader.onloadend = () => {
                this.setState(prevState => ({
                    files: this.props.categoryId != undefined ? [file] : [...prevState.files, file],
                    imagesPreviewUrls: this.props.categoryId != undefined ?
                        [reader.result]
                        :[...prevState.imagesPreviewUrls, reader.result]
                }));
            }
            reader.readAsDataURL(file);
        });
    }

    render() {
        let {imagesPreviewUrls} = this.state || [] ;
        const label = this.props.categoryId ?  'Выбрать картинку для этой категории ' : 'Выбрать картинки для этого рецепта '

        return (
            <div>
                <form onSubmit={this._handleSubmit}>
                    <label
                        className="btn btn-default btn-sm"
                        htmlFor="file">
                        {label}
                        <i className="fas fa-image fa-fw" aria-hidden="true"></i>
                        <input className="upload" type="file" onChange={this._handleImageChange} multiple/>
                    </label>
                    <button type="submit" onClick={this._handleSubmit}>
                        {this.props.recipeId && 'Upload Images'}
                        {this.props.categoryId && 'Загрузить'}

                    </button>
                </form>
                {imagesPreviewUrls && imagesPreviewUrls.map(function (imagePreviewUrl, i) {
                    return <img key={i} src={imagePreviewUrl}/>
                })}
            </div>
        )
    }
}

export default ImageUpload;