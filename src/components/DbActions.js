import { db } from '../lib/firebase';

export function newCategory(id, catData) {
    const updates = {};
    updates['/recipie_categories/' + id] = catData;
    updateDb(updates)
}

export function deleteCategory(id) {
    db.database().ref().child('recipie_categories/' + id).remove();
}

export function updateCategory(id, catData, callback) {
    const updates = {};
    updates['/recipie_categories/' + id] = catData;
    updateDb(updates, callback)
}

export function newRecipie(id, recData) {
    const updates = {};
    updates['/recipies/' + id] = recData;
    updateDb(updates)
}

export function updateRec(id, recData, callback) {
    const updates = {};
    updates['/recipies/' + id] = recData;
    updateDb(updates, callback)
}

export function deleteRecipe(id) {
    db.database().ref().child('recipies/' + id).remove();
}

export function updateComposition(chagedIngridient) {
    const {rec_id, ing_id, comp_id, quantity} = chagedIngridient;
    const composition = {
        comp_id: comp_id,
        ing_id: ing_id,
        quantity: quantity,
        rec_id: rec_id,
    };
    const updates = {};
    updates['/recipie_composition/' + comp_id] = composition;
    updateDb(updates);
}

export function newComposition(newComposition) {
    const {rec_id, ing_id, quantity} = newComposition;
    const newKey = db.database().ref().child('recipie_composition').push().key;
    const composition = {
        comp_id: newKey,
        ing_id: ing_id,
        quantity: quantity,
        rec_id: rec_id,
    }
    const updates = {};
    updates['/recipie_composition/' + newKey] = composition;
    updateDb(updates);
}

export function deleteComposition(idComposition) {
    db.database().ref().child('recipie_composition/' + idComposition).remove();
}

export function updateIngridient(chagedIngridient) {
    const {rec_id, ing_id, name} = chagedIngridient;
    const ingridient = {
        ing_id: ing_id,
        name: name,
        rec_id: rec_id
    };
    const updates = {};
    updates['/recipie_ingridients/' + ing_id] = ingridient;
    updateDb(updates);
}

export function deleteIngridient(idIngridient) {
    db.database().ref().child('recipie_ingridients/' + idIngridient).remove();
}

export function newIngridient(newIngridient) {
    const {rec_id, name} = newIngridient;
    const newKey = db.database().ref().child('recipie_ingridients').push().key;
    const ingridient = {
        ing_id: newKey,
        name: name,
        rec_id: rec_id
    }
    const updates = {};
    updates['/recipie_ingridients/' + newKey] = ingridient;
    updateDb(updates);
}

export function newImage(file, path, callback) {
    const storageRef = db.storage().ref();
    const imagesRef = storageRef.child(path);
    imagesRef.put(file).then(function (snapshot) {
        callback && imagesRef.getDownloadURL().then(function (url) {
            callback(url)
        })
    });
}

export function getPageContent(id, callback) {
    return db.database().ref('/pages/').on('value',
        (snapshot) => {
            callback(snapshot.child(id).val());
        })
}

export  function savePageContent(id, content) {
    const updates = {};
    updates['/pages/' + id] = content;
    updateDb(updates);
}

export  function deleteImage(url, callback) {
    const ref = db.storage().refFromURL(url);
    ref.delete().then(function() {
        callback(url)
    }).catch(function(error) {
        // error occurred
    });
}

export function getImagesForRecipe(recipeId, callback) {
    const storageRef = db.storage().ref();
    const listRef = storageRef.child('images/' + recipeId + '/');
    listRef.listAll().then(function (res) {
        res.items.forEach(function (itemRef,i) {
            // All the items under listRef.
            itemRef.getDownloadURL().then(function (url) {
                callback(url,i)
            })
        });
    }).catch(function (error) {
        // Uh-oh, an error occurred!
    });
}

function updateDb(updates, callback) {
    return db.database().ref().update(updates, function (error) {
        if (error) {
            // The write failed...
            console.log('failed', error)
        } else {
            callback && callback();
            console.log('successfully')
            // Data saved successfully!
        }
    });
}
