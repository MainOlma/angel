import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyAsO8JrmAE6QPA8btFOYXHEbrEgD86QSuM",
    authDomain: "kakeses.firebaseapp.com",
    databaseURL: "https://kakeses.firebaseio.com",
    projectId: "kakeses",
    storageBucket: "kakeses.appspot.com",
    messagingSenderId: "400500675421",
    appId: "1:400500675421:web:479ddb31f593a883daceb4"
};
export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();

