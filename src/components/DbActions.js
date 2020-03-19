import base from "./Base"

export function newCategory(id, catData) {
    const updates = {};
    updates['/recipie_categories/' + id] = catData;
    updateDb(updates)
}

export function deleteCategory(id) {
    base.database().ref().child('recipie_categories/' + id).remove();
}

export function updateCategory(id, catData) {
    const updates = {};
    updates['/recipie_categories/' + id] = catData;
    updateDb(updates)
}

export function newRecipie(id, recData) {
    const updates = {};
    updates['/recipies/' + id] = recData;
    updateDb(updates)
}

export function updateRec(id, recData) {
    const updates = {};
    updates['/recipies/' + id] = recData;
    updateDb(updates)
}

export function deleteRecipe(id) {
    base.database().ref().child('recipies/' + id).remove();
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
    const newKey = base.database().ref().child('recipie_composition').push().key;
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
    base.database().ref().child('recipie_composition/' + idComposition).remove();
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
    base.database().ref().child('recipie_ingridients/' + idIngridient).remove();
}

export function newIngridient(newIngridient) {
    const {rec_id, name} = newIngridient;
    const newKey = base.database().ref().child('recipie_ingridients').push().key;
    const ingridient = {
        ing_id: newKey,
        name: name,
        rec_id: rec_id
    }
    const updates = {};
    updates['/recipie_ingridients/' + newKey] = ingridient;
    updateDb(updates);
}

export function newImage(file, path) {
    const storageRef = base.storage().ref();
    const imagesRef = storageRef.child(path);
    imagesRef.put(file).then(function (snapshot) {
        console.log('Uploaded file!', imagesRef.fullPath);
    });
}

export function getPageContent(id, callback) {
    return base.database().ref('/pages/').on('value',
        (snapshot) => {
            callback(snapshot.child(id).val());
        })
}

export  function savePageContent(id, content) {
    const updates = {};
    updates['/pages/' + id] = content;
    updateDb(updates);
}

function updateDb(updates) {
    return base.database().ref().update(updates, function (error) {
        if (error) {
            // The write failed...
            console.log('failed', error)
        } else {
            console.log('successfully')
            // Data saved successfully!
        }
    });
}
