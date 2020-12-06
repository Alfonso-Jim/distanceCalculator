import Vue from 'vue'
import App from './App'
import router from './router'
import firebase from 'firebase';
import "semantic-ui-css/semantic.min.css";

Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: "YOUR-KEY",
  authDomain: "geolocation-vue.firebaseapp.com",
  databaseURL: "YOUR-FIREBASE-PROJECT-URL",
  projectId: "geolocation-vue",
  storageBucket: "geolocation-vue.appspot.com",
  messagingSenderId: "YOUR-MESSAGE-SENDER-ID",
  appId: "YOUR-APP-ID"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

console.log(firebase);

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
