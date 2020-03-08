import base from "./Base"

export function updateRec(id, recData) {
    const updates = {};
    updates['/recipies/' + id] = recData;
    updateDb(updates)
}

export function updateComposition(chagedIngridient) {
    const {rec_id, ing_id, comp_id, quantity} = chagedIngridient;
    const composition = {
        comp_id: comp_id,
        ing_id: ing_id,
        quantity: quantity,
        rec_id: rec_id,
    }
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
    window.location.reload(true);
}

export function deleteComposition(idComposition) {
    base.database().ref().child('recipie_composition/' + idComposition).remove();
    window.location.reload(true);
}

export function updateIngridient(chagedIngridient) {
    const {rec_id, ing_id, name, units} = chagedIngridient;
    const ingridient = {
        ing_id: ing_id,
        name: name,
        rec_id: rec_id,
        units: units,
    };
    const updates = {};
    updates['/recipie_ingridients/' + ing_id] = ingridient;
    updateDb(updates);
}
export function deleteIngridient(idIngridient) {
    base.database().ref().child('recipie_ingridients/' + idIngridient).remove();
}

export function newIngridient(newIngridient) {
    const {rec_id, units, name} = newIngridient;
    const newKey = base.database().ref().child('recipie_ingridients').push().key;
    const ingridient = {
        ing_id: newKey,
        name: name,
        rec_id: rec_id,
        units: units,
    }
    const updates = {};
    updates['/recipie_ingridients/' + newKey] = ingridient;
    updateDb(updates);
    //window.location.reload(true);
}

function updateDb(updates) {
    return base.database().ref().update(updates, function (error) {
        if (error) {
            // The write failed...
            console.log('failed', error)
        } else {
            console.log('successfully')
            // Data saved successfully!
            //window.location.reload(true);
        }
    });
}
