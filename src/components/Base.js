import * as firebase from 'firebase';
import dbConfig from '../constants/dbConfig';

export default !firebase.apps.length ? firebase.initializeApp(dbConfig) : firebase.app();

