import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: 'AIzaSyAainkwn3N5UXiPPsPoctqm2HfL9m58oCw',
  authDomain: 'trello-example.firebaseapp.com',
  databaseURL: 'https://trello-example.firebaseio.com/',
  projectId: 'trello-example',
  storageBucket: 'trello-example.appspot.com',
  messagingSenderId: '773287078062',
  appId: '1:773287078062:web:b7f4e3418563771e7fe53f',
};

firebase.initializeApp(firebaseConfig);

export { firebase };
