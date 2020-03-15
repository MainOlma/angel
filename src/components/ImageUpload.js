import React from 'react';
import base from "./Base";

class ImageUpload extends React.Component {
    state = {
        files: [],
        imagesPreviewUrls: []
    };
    _handleSubmit = e => {
        e.preventDefault();
        const file = this.state.files[0];
        const storageRef = base.storage().ref();
        const mountainImagesRef = storageRef.child('images/'+this.props.recipeId+'/'+file.name);
        mountainImagesRef.put(file).then(function(snapshot) {
            console.log('Uploaded a blob or file!', mountainImagesRef.fullPath);
        });
    }

    _handleImageChange = e => {
        e.preventDefault();

        // FileList to Array
        let files = Array.from(e.target.files);

        // File Reader for Each file and and update state arrays
        files.forEach((file, i) => {
            let reader = new FileReader();

            reader.onloadend = () => {
                this.setState(prevState => ({
                    files: [...prevState.files, file],
                    imagesPreviewUrls: [...prevState.imagesPreviewUrls, reader.result]
                }));
            }
            reader.readAsDataURL(file);
        });
    }

    render() {
        let {imagesPreviewUrls} = this.state;

        return (
            <div>
                <form onSubmit={this._handleSubmit}>
                    <label
                        className="btn btn-default btn-sm"
                        htmlFor="file">
                        <i className="fas fa-image fa-fw" aria-hidden="true"></i>
                        <input className="upload" type="file" onChange={this._handleImageChange} multiple/>
                    </label>
                    <button type="submit" onClick={this._handleSubmit}>Upload Images</button>
                </form>
                {imagesPreviewUrls.map(function (imagePreviewUrl, i) {
                    return <img key={i} src={imagePreviewUrl}/>
                })}
            </div>
        )
    }
}

export default ImageUpload;