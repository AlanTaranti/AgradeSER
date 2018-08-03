// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import VueFire from 'vuefire'
import firebase from 'firebase'
import 'vuetify/dist/vuetify.min.css'
import store from '@/vuex/store';
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader
import colors from 'vuetify/es5/util/colors'


Vue.use(Vuetify, {
  iconfont: 'fa',
  theme: {
    primary: colors.lightGreen.darken3,
    secondary: '#424242',
    accent: '#82B1FF',
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
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

      firebase() {
        return {
          'usuario': db.collection('usuario').doc(user.uid),
          'relatos': db.collection('usuario').doc(user.uid).collection('relatos')
        }
      },

      created() {
        this.$store.commit('drawerBreakpointEmTelaGrande', 1264);
      }
    })
  }
});
