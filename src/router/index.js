import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/views/autenticado/Home'
import Estrutura from '@/views/autenticado/Estrutura'
import Login from '@/views/Login'
import SignUp from '@/views/SignUp'
import firebase from 'firebase'

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '*',
      redirect: '/login',
      meta: {
        authPage: true
      }
    },
    {
      path: '/',
      redirect: '/login',
      meta: {
        authPage: true
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        authPage: true
      }
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp,
      meta: {
        authPage: true
      }
    },
    {
      path: '',
      name: 'estrutura',
      component: Estrutura,
      children: [
        {
          path: '/home',
          name: 'home',
          component: Home,
        },
      ],
    },
  ]
});

router.beforeEach((to, from, next) => {
  let currentUser = firebase.auth().currentUser;
  let authPage = to.matched.some(record => record.meta.authPage);
  let anonymousAccess = to.matched.some(record => record.meta.anonymousAccess);

  if (anonymousAccess) next();
  else if (!authPage && !currentUser) next('login');
  else if (authPage && currentUser) next('home');
  else next()
});

export default router
