import * as firebase from 'firebase';
import dbConfig from '../constants/dbConfig';

const db = !firebase.apps.length ? firebase.initializeApp(dbConfig) : firebase.app();

export { firebase, db };
