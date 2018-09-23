// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import firebase from 'firebase'
import 'vuetify/dist/vuetify.min.css'
import store from './vuex/store';
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import colors from 'vuetify/es5/util/colors'


Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: '#F98443',
    secondary: colors.lightGreen.darken1,
    accent: '#EF606F',

    background: '#FFFAFA',
    background_primary_lighten: colors.lightGreen.lighten5,

    error: colors.red.lighten1,
    info: colors.lightBlue.lighten1,
    success: colors.lightGreen.darken3,
    warning: colors.yellow.darken1,
  }
});

/* Firebase */
Vue.use(VueFire);
const config = {
  apiKey: 'AIzaSyCtrcgkw_PmywJBBeHX4X1eFFojkq_4ejY',
  authDomain: 'diarioplus-1.firebaseapp.com',
  databaseURL: 'https://diarioplus-1.firebaseio.com',
  projectId: 'diarioplus-1',
  storageBucket: 'diarioplus-1.appspot.com',
  messagingSenderId: '1031309102626',
};
const firebaseApp = firebase.initializeApp(config);
const db = firebaseApp.firestore();
db.settings({timestampsInSnapshots: true});
db.enablePersistence();
export default db;


Vue.config.productionTip = false;
let app;

firebase.auth().onAuthStateChanged(function (user) {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store: store,
      components: {App},
      template: '<App/>',

      created() {
        this.$store.commit('drawerBreakpointEmTelaGrande', 1264);
      }
    })
  }
});
